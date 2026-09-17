import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { aiService, ChatMessage } from '../../services/aiService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const PRESET_QUESTIONS = [
  'What is Paracetamol used for?',
  'How should Vitamin D be taken?',
  'What causes common headaches?',
  'Is Amoxicillin safe with food?'
];

export const HealthAssistantScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your PharmaGo Health Assistant. How can I help you with medicine information or health queries today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await aiService.askAssistant(text.trim());
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I am currently unable to process your query. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAi]}>
        {!isUser && <Text style={styles.botIcon}>🤖</Text>}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.msgText, isUser ? styles.userMsgText : styles.aiMsgText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestampText, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Medical Disclaimer Banner */}
      <View style={styles.disclaimerBanner}>
        <Text style={styles.disclaimerIcon}>⚠️</Text>
        <Text style={styles.disclaimerText}>
          This assistant is not a doctor and does not provide medical advice. Always consult a certified healthcare professional.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.chatPadding}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingFooter}>
                <LoadingSpinner size="small" message="Assistant is thinking..." />
              </View>
            ) : null
          }
        />

        {/* Suggested Quick Questions */}
        {messages.length < 4 && (
          <View style={styles.presetsContainer}>
            <Text style={styles.presetsLabel}>Suggested Questions:</Text>
            <View style={styles.presetsWrap}>
              {PRESET_QUESTIONS.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={styles.presetChip}
                  onPress={() => handleSendMessage(q)}
                >
                  <Text style={styles.presetChipText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about medicines or symptoms..."
            placeholderTextColor={colors.dark.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || isLoading) && styles.sendBtnDisabled]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendBtnIcon}>➔</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.amber[900] + '40',
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.amber[700]
  },
  disclaimerIcon: {
    fontSize: 16,
    marginRight: spacing.xs
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.amber[300],
    flex: 1,
    lineHeight: 16
  },
  keyboardContainer: {
    flex: 1
  },
  chatPadding: {
    padding: spacing.md
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end'
  },
  msgRowUser: {
    justifyContent: 'flex-end'
  },
  msgRowAi: {
    justifyContent: 'flex-start'
  },
  botIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
    marginBottom: 4
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg
  },
  userBubble: {
    backgroundColor: colors.emerald[600],
    borderBottomRightRadius: 2
  },
  aiBubble: {
    backgroundColor: colors.dark.bgSecondary,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderBottomLeftRadius: 2
  },
  msgText: {
    ...typography.body2,
    lineHeight: 20
  },
  userMsgText: {
    color: colors.neutral[900],
    fontWeight: '500'
  },
  aiMsgText: {
    color: colors.dark.textPrimary
  },
  timestampText: {
    ...typography.caption,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  userTimestamp: {
    color: colors.emerald[900]
  },
  aiTimestamp: {
    color: colors.dark.textMuted
  },
  loadingFooter: {
    paddingVertical: spacing.sm
  },
  presetsContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm
  },
  presetsLabel: {
    ...typography.caption,
    color: colors.dark.textMuted,
    marginBottom: spacing.xs
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs
  },
  presetChip: {
    backgroundColor: colors.dark.bgSecondary,
    borderWidth: 1,
    borderColor: colors.dark.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: spacing.borderRadius.round
  },
  presetChipText: {
    ...typography.caption,
    color: colors.emerald[400]
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.dark.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border
  },
  input: {
    flex: 1,
    backgroundColor: colors.dark.bgTertiary,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.dark.textPrimary,
    maxHeight: 100,
    marginRight: spacing.sm
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.emerald[500],
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    backgroundColor: colors.dark.border,
    opacity: 0.5
  },
  sendBtnIcon: {
    color: colors.neutral[900],
    fontSize: 18,
    fontWeight: '700'
  }
});
