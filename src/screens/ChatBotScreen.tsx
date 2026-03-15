import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';

type Message = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  suggestions?: string[];
};

// --- Simple rule-based response engine ---
type Rule = { keywords: string[]; response: string; suggestions?: string[] };

const RULES: Rule[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'start', 'help'],
    response:
      "Hello! I'm SpectoBot 👋 — your SpectoCare assistant. I can help you with information about ASD, app features, behaviour strategies, and more. What would you like to know?",
    suggestions: ['What is ASD?', 'How do I add a child?', 'Tell me about meltdowns'],
  },
  {
    keywords: ['what is asd', 'autism', 'asd', 'autistic', 'spectrum'],
    response:
      'Autism Spectrum Disorder (ASD) is a neurodevelopmental condition characterised by differences in social communication, sensory processing, and behaviour. It\'s a spectrum — each person\'s experience is unique. Early intervention and consistent support can make a significant positive difference.',
    suggestions: ['What causes ASD?', 'Signs of ASD?', 'ASD resources'],
  },
  {
    keywords: ['causes', 'why autism', 'cause of asd'],
    response:
      'The exact causes of ASD are not fully understood, but research suggests it involves a combination of genetic and environmental factors. It is NOT caused by vaccines or parenting style. Genetics play a significant role, and multiple genes are likely involved.',
    suggestions: ['What are signs of ASD?', 'How is ASD diagnosed?'],
  },
  {
    keywords: ['signs', 'symptoms', 'diagnosis', 'detect', 'diagnose'],
    response:
      'Common early signs of ASD include: limited eye contact, delayed speech or language, repetitive behaviours, difficulty with social interaction, sensory sensitivities, and strong adherence to routines. A formal diagnosis is made by a qualified multidisciplinary team.',
    suggestions: ['Use the Symptom Checker', 'What therapies help?'],
  },
  {
    keywords: ['meltdown', 'tantrum', 'crisis', 'overwhelm', 'shutdown'],
    response:
      'A meltdown is a neurological response to sensory or emotional overload — not a behaviour choice. Key strategies:\n\n• Stay calm and reduce demands immediately\n• Minimise sensory input (dim lights, reduce noise)\n• Give space — avoid touch unless welcomed\n• Don\'t try to reason during the meltdown\n• Debrief kindly afterwards, not during\n\nConsider tracking triggers using the Behaviour Tracker in the app.',
    suggestions: ['How to track behaviour?', 'What is a sensory diet?'],
  },
  {
    keywords: ['sensory', 'sensory diet', 'sensory processing', 'sensitive'],
    response:
      'Sensory processing differences are common in ASD. A "sensory diet" is a personalised set of sensory activities (e.g. deep pressure, movement breaks, calm spaces) prescribed by an occupational therapist. It helps the nervous system stay regulated throughout the day.',
    suggestions: ['Find a facility', 'Tell me about OT'],
  },
  {
    keywords: ['routine', 'schedule', 'structure'],
    response:
      'Predictable routines reduce anxiety for many children with ASD. Visual schedules (pictures or icons for each step) are especially effective. Use the Daily Routine feature in the app to build and share consistent schedules across all caregivers.',
    suggestions: ['How do I create a routine?', 'Visual supports'],
  },
  {
    keywords: ['add child', 'profile', 'child profile', 'set up'],
    response:
      'To add a child profile: go to the Home screen → tap "Add your first child" → fill in name, date of birth, diagnosis, and any notes. You can manage multiple child profiles and switch between them at any time from the home screen.',
    suggestions: ['What features are available?', 'How to track behaviour?'],
  },
  {
    keywords: ['behaviour', 'behavior', 'track', 'log', 'abc'],
    response:
      'The Behaviour Tracker lets you log incidents using an ABC format (Antecedent → Behaviour → Consequence). This helps identify patterns and triggers over time. Access it from Quick Actions on the Home screen or navigate to a child\'s profile.',
    suggestions: ['What is ABC tracking?', 'How to manage meltdowns?'],
  },
  {
    keywords: ['abc', 'antecedent', 'consequence'],
    response:
      'ABC tracking is a structured observation method:\n\n• A — Antecedent: what happened immediately before the behaviour\n• B — Behaviour: the specific behaviour observed\n• C — Consequence: what happened immediately after\n\nCollecting ABC data helps therapists and educators design targeted support plans.',
    suggestions: ['Open Behaviour Tracker', 'What else can I track?'],
  },
  {
    keywords: ['journal', 'diary', 'notes', 'log feelings'],
    response:
      'The Journal section allows you to record daily entries, moods, and observations for each child. Journals are private and help you notice patterns over weeks and months. Tap "Journal" in Quick Actions to get started.',
    suggestions: ['What moods can I log?', 'Privacy and data'],
  },
  {
    keywords: ['community', 'forum', 'other parents', 'connect'],
    response:
      'The Community tab connects you with other parents and caregivers. You can read and post discussions, ask questions, and share experiences. Community posts are moderated to ensure a safe, supportive environment.',
    suggestions: ['Go to Community', 'Privacy and data'],
  },
  {
    keywords: ['facility', 'facilities', 'clinic', 'therapist', 'specialist', 'find'],
    response:
      'Use "Find Facility" to search for ASD-specialised clinics, therapists, schools, and support services near you. Each listing includes contact details, specialties, and directions.',
    suggestions: ['What therapies are available?', 'Types of therapy'],
  },
  {
    keywords: ['therapy', 'therapies', 'aba', 'speech', 'ot', 'occupational'],
    response:
      'Common therapies for ASD include:\n\n• ABA (Applied Behaviour Analysis) — structured skill-building\n• Speech & Language Therapy — communication and social communication\n• Occupational Therapy (OT) — daily living skills, sensory processing\n• Social Skills Groups — peer interaction in guided settings\n• CBT (for older children) — managing anxiety and emotions\n\nAn experienced multidisciplinary team is ideal.',
    suggestions: ['Find a facility', 'What is early intervention?'],
  },
  {
    keywords: ['early intervention', 'early support', 'young child'],
    response:
      'Research consistently shows that early intervention (ideally before age 5) leads to significantly better outcomes in communication, social skills, and adaptive behaviour. If you suspect ASD, seek a developmental assessment as soon as possible — you don\'t need to wait for a formal diagnosis to start support.',
    suggestions: ['How is ASD diagnosed?', 'Find a facility'],
  },
  {
    keywords: ['shadow', 'shadow request', 'aide', 'support worker'],
    response:
      'A shadow (or shadow aide) is a trained support person who assists a child in a school or community setting. They provide 1:1 support to help with learning, transitions, communication, and regulation. Use the Shadow Request feature in the app to submit a request.',
    suggestions: ['Submit a Shadow Request', 'What is a shadow aide?'],
  },
  {
    keywords: ['guided learning', 'learn', 'module', 'course', 'education'],
    response:
      'Guided Learning provides structured modules for parents and caregivers covering Communication Strategies, Social Skills Development, Behaviour Support, and Family Wellbeing. Each lesson includes practical tips and you can track your progress.',
    suggestions: ['Open Guided Learning', 'Tell me about visual supports'],
  },
  {
    keywords: ['privacy', 'data', 'secure', 'safe', 'information'],
    response:
      'SpectoCare takes privacy seriously. All personal data is stored securely and never sold to third parties. You control your data and can request deletion at any time by contacting support.',
    suggestions: ['Contact support', 'What data do you store?'],
  },
  {
    keywords: ['symptom checker', 'check symptoms', 'symptoms'],
    response:
      'The Symptom Checker helps you identify common ASD-related behaviours and concerns. Select the behaviours you\'ve observed and receive tailored guidance. It is NOT a diagnostic tool but can help you prepare for professional assessments.',
    suggestions: ['Open Symptom Checker', 'How is ASD diagnosed?'],
  },
];

const FALLBACK: Message = {
  id: 'fallback',
  role: 'bot',
  text: "I'm not sure about that, but I'd love to help! Try rephrasing your question or choose from the suggestions below.",
  suggestions: ['What is ASD?', 'App features', 'Find a facility', 'Behaviour strategies'],
};

function getBotResponse(input: string): Message {
  const lower = input.toLowerCase();
  const matched = RULES.find((rule) =>
    rule.keywords.some((kw) => lower.includes(kw))
  );
  if (matched) {
    return {
      id: Date.now().toString(),
      role: 'bot',
      text: matched.response,
      suggestions: matched.suggestions,
    };
  }
  return { ...FALLBACK, id: Date.now().toString() };
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'bot',
  text: "Hi there! I'm SpectoBot 👋 — your SpectoCare assistant. Ask me anything about ASD, the app, or how to support your child.",
  suggestions: ['What is ASD?', 'App features', 'Behaviour strategies', 'Find a therapist'],
};

const QUICK_CHIPS = [
  'What is ASD?',
  'Handling meltdowns',
  'Daily routines',
  'Find a facility',
  'Shadow support',
];

export default function ChatBotScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        text: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setThinking(true);

      // Simulate typing delay
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

      const botMsg = getBotResponse(trimmed);
      setMessages((prev) => [...prev, botMsg]);
      setThinking(false);

      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    },
    [thinking]
  );

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={16} color={Colors.primary} />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{item.text}</Text>
          {item.suggestions && (
            <View style={styles.suggestionsRow}>
              {item.suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(s)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.botAvatarLg}>
            <Ionicons name="sparkles" size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>SpectoBot</Text>
            <Text style={styles.headerSub}>AI Support Assistant</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            thinking ? (
              <View style={styles.typingRow}>
                <View style={styles.botAvatar}>
                  <Ionicons name="sparkles" size={16} color={Colors.primary} />
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={Colors.textMuted} />
                  <Text style={styles.typingText}>SpectoBot is thinking…</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick chips */}
        {messages.length <= 1 && (
          <View style={styles.chipsScroll}>
            {QUICK_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip}
                style={styles.chip}
                onPress={() => sendMessage(chip)}
                activeOpacity={0.75}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything…"
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || thinking) && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || thinking}
          >
            <Ionicons name="send" size={18} color={Colors.textOnPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  botAvatarLg: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: `${Colors.primary}18`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  messageList: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: `${Colors.primary}18`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs,
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  bubbleBot: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    ...Shadow.sm,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: Spacing.xs,
  },
  bubbleText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: Colors.textOnPrimary,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  suggestionChip: {
    backgroundColor: `${Colors.primary}14`,
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  suggestionText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },

  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: 4,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  typingText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  chipsScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
});
