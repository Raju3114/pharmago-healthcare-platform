package com.pharmago.service.impl;

import com.pharmago.dto.request.PrescriptionReviewDto;
import com.pharmago.dto.response.PageResponseDto;
import com.pharmago.dto.response.PrescriptionResponseDto;
import com.pharmago.enums.NotificationType;
import com.pharmago.enums.PrescriptionStatus;
import com.pharmago.exception.BadRequestException;
import com.pharmago.exception.ResourceNotFoundException;
import com.pharmago.model.Order;
import com.pharmago.model.Prescription;
import com.pharmago.model.User;
import com.pharmago.repository.OrderRepository;
import com.pharmago.repository.PrescriptionRepository;
import com.pharmago.repository.UserRepository;
import com.pharmago.service.NotificationService;
import com.pharmago.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "pdf");
    private static final String UPLOAD_DIR = "uploads/prescriptions/";

    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PrescriptionResponseDto uploadPrescription(String userEmail, MultipartFile file, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File must not be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum allowed limit of 5MB");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "prescription");
        String extension = getFileExtension(originalFileName);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BadRequestException("Invalid file format. Allowed formats: JPG, JPEG, PNG, PDF");
        }

        Order order = null;
        if (orderId != null) {
            order = orderRepository.findByIdAndUserId(orderId, user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        }

        String generatedFileName = UUID.randomUUID() + "." + extension;
        String fileUrl = storeFileLocally(file, generatedFileName);

        Prescription prescription = Prescription.builder()
                .user(user)
                .order(order)
                .fileName(generatedFileName)
                .fileUrl(fileUrl)
                .originalFileName(originalFileName)
                .fileSize(file.getSize())
                .status(PrescriptionStatus.PENDING)
                .build();

        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return mapToPrescriptionResponseDto(savedPrescription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDto> getUserPrescriptions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return prescriptionRepository.findByUserIdOrderByUploadedAtDesc(user.getId())
                .stream()
                .map(this::mapToPrescriptionResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionResponseDto getPrescriptionById(String userEmail, Long id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Prescription prescription = prescriptionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with ID: " + id));

        return mapToPrescriptionResponseDto(prescription);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<PrescriptionResponseDto> getAllPrescriptions(PrescriptionStatus status, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("uploadedAt").descending());

        Page<Prescription> prescriptionPage;
        if (status != null) {
            prescriptionPage = prescriptionRepository.findByStatus(status, pageable);
        } else {
            prescriptionPage = prescriptionRepository.findAll(pageable);
        }

        Page<PrescriptionResponseDto> dtoPage = prescriptionPage.map(this::mapToPrescriptionResponseDto);
        return PageResponseDto.fromPage(dtoPage);
    }

    @Override
    @Transactional
    public PrescriptionResponseDto reviewPrescription(Long id, PrescriptionReviewDto reviewDto) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with ID: " + id));

        prescription.setStatus(reviewDto.getStatus());
        prescription.setAdminNotes(reviewDto.getAdminNotes());
        prescription.setReviewedAt(LocalDateTime.now());

        Prescription updatedPrescription = prescriptionRepository.save(prescription);

        // Dispatch Automatic Prescription Review Notification
        String title = (reviewDto.getStatus() == PrescriptionStatus.APPROVED)
                ? "Prescription Approved"
                : "Prescription Rejected";

        String message = (reviewDto.getStatus() == PrescriptionStatus.APPROVED)
                ? "Your prescription #" + id + " has been approved by our pharmacist."
                : "Your prescription #" + id + " was rejected. Reason: " + (reviewDto.getAdminNotes() != null ? reviewDto.getAdminNotes() : "Invalid or illegible document.");

        notificationService.sendNotification(
                updatedPrescription.getUser(),
                title,
                message,
                NotificationType.PRESCRIPTION_UPDATE,
                updatedPrescription.getId()
        );

        return mapToPrescriptionResponseDto(updatedPrescription);
    }

    private String storeFileLocally(MultipartFile file, String fileName) {
        try {
            Path targetLocation = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            Files.createDirectories(targetLocation);

            Path filePath = targetLocation.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/prescriptions/" + fileName;
        } catch (IOException ex) {
            log.error("Could not store file: {}", ex.getMessage());
            throw new BadRequestException("Could not store file " + fileName + ". Please try again!");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    private PrescriptionResponseDto mapToPrescriptionResponseDto(Prescription prescription) {
        return PrescriptionResponseDto.builder()
                .id(prescription.getId())
                .userId(prescription.getUser().getId())
                .userName(prescription.getUser().getFullName())
                .userEmail(prescription.getUser().getEmail())
                .orderId(prescription.getOrder() != null ? prescription.getOrder().getId() : null)
                .orderNumber(prescription.getOrder() != null ? prescription.getOrder().getOrderNumber() : null)
                .fileName(prescription.getFileName())
                .fileUrl(prescription.getFileUrl())
                .originalFileName(prescription.getOriginalFileName())
                .fileSize(prescription.getFileSize())
                .status(prescription.getStatus())
                .adminNotes(prescription.getAdminNotes())
                .uploadedAt(prescription.getUploadedAt())
                .reviewedAt(prescription.getReviewedAt())
                .build();
    }
}
