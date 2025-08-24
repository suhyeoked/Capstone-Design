import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
} from 'react-native-calendars';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ---------- Types ---------- */
type SubTask = { id: string; text: string; done: boolean };
type Goal = {
  id: string;
  date: string;                 // YYYY-MM-DD
  title: string;
  subtasks: SubTask[];
  status: 'ongoing' | 'done';
  open?: boolean;               // accordion UI
};
type GoalsByDate = Record<string, Goal[]>;

/* ---------- Component ---------- */
export default function HomeScreen( {navigation} ) {
  const route = useRoute(); // ✅ 현재 화면의 route 객체
  const today = new Date().toISOString().slice(0, 10);

  // ... 기존 코드 유지 ...

  /* ----- GoalSetupWizard에서 전달된 newGoal 처리 ----- */
  useEffect(() => {
    if (route.params && (route.params as any).newGoal) {
      const newGoal = (route.params as any).newGoal as Goal;

      // 해당 날짜 목표 배열에 추가
      setGoalsByDate(prev => ({
        ...prev,
        [newGoal.date]: [newGoal, ...(prev[newGoal.date] ?? [])],
      }));

      // param 초기화 (중복 추가 방지)
      navigation.setParams({ newGoal: undefined });
    }
  }, [route.params]);
  const [selected, setSelected] = useState(today);
  const [goalsByDate, setGoalsByDate] = useState<GoalsByDate>({});

  const handleGoalSetupWizard = () =>{
    navigation.navigate('GoalSetupWizard');
  };

  

  // bottom sheet inputs
  const [sheetOpen, setSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [tag, setTag] = useState('');

  /* ----- Load/Save ----- */
  useEffect(() => {
    (async () => {
      const g = await AsyncStorage.getItem('@goalsByDate');
      const s = await AsyncStorage.getItem('@selectedDate');
      if (g) setGoalsByDate(JSON.parse(g));
      if (s) setSelected(JSON.parse(s));
    })();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem('@goalsByDate', JSON.stringify(goalsByDate));
    AsyncStorage.setItem('@selectedDate', JSON.stringify(selected));
  }, [goalsByDate, selected]);

  /* ----- Derived ----- */
  const goalsForSelected = useMemo(() => goalsByDate[selected] ?? [], [goalsByDate, selected]);
  const ongoing = goalsForSelected.filter(g => g.status === 'ongoing');
  const done = goalsForSelected.filter(g => g.status === 'done');

  const marked = useMemo(() => ({
    [selected]: { selected: true, selectedColor: '#0ea5e9' }
  }), [selected]);

  // AgendaList 섹션 (선택한 날짜 한 섹션만 사용)
  const sections = useMemo(() => ([
    { title: selected, data: ['content'] }
  ]), [selected, ongoing, done]);

  /* ----- Actions ----- */
  const addGoal = () => {
    const t = title.trim();
    if (!t) return;
    const now = Date.now();
    const goal: Goal = {
      id: `${now}`,
      date: selected,
      title: t,
      status: 'ongoing',
      open: true,
      subtasks: [
        { id: `${now}-1`, text: detail.trim() || `${t} 하위 작업`, done: false },
      ],
    };
    LayoutAnimation.easeInEaseOut();
    setGoalsByDate(prev => ({ ...prev, [selected]: [goal, ...(prev[selected] ?? [])] }));
    setTitle(''); setDetail(''); setTag('');
    setSheetOpen(false);
  };

  const toggleOpen = (goalId: string) => {
    LayoutAnimation.easeInEaseOut();
    setGoalsByDate(prev => ({
      ...prev,
      [selected]: (prev[selected] ?? []).map(g => g.id === goalId ? { ...g, open: !g.open } : g)
    }));
  };

  const toggleSubtask = (goalId: string, subId: string) => {
    setGoalsByDate(prev => {
      const list = (prev[selected] ?? []).map(g => {
        if (g.id !== goalId) return g;
        const subtasks = g.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s);
        const allDone = subtasks.length > 0 && subtasks.every(s => s.done);
        return { ...g, subtasks, status: allDone ? 'done' : 'ongoing' };
      });
      return { ...prev, [selected]: list };
    });
  };

  const removeGoal = (goalId: string) => {
    LayoutAnimation.easeInEaseOut();
    setGoalsByDate(prev => ({
      ...prev,
      [selected]: (prev[selected] ?? []).filter(g => g.id !== goalId)
    }));
  };

  /* ---------- Render helpers ---------- */
  const renderContentItem = () => (
    <View style={styles.content}>
      {/* 섹션: 진행 중 */}
      <Text style={styles.sectionTitle}>진행 중인 목표</Text>
      {ongoing.length === 0 ? (
        <Text style={styles.empty}>현재 진행 중인 목표가 없어요.</Text>
      ) : (
        ongoing.map(goal => (
          <View key={goal.id} style={styles.card}>
            <Pressable style={styles.cardHeader} onPress={() => toggleOpen(goal.id)}>
              <Text style={styles.cardTitle}>{goal.title}</Text>
              <Text style={styles.chevron}>{goal.open ? '▾' : '▸'}</Text>
            </Pressable>
            {goal.open && (
              <View style={{ marginTop: 8 }}>
                {goal.subtasks.map(st => (
                  <Pressable
                    key={st.id}
                    style={styles.subRow}
                    onPress={() => toggleSubtask(goal.id, st.id)}
                  >
                    <View style={[styles.checkbox, st.done && styles.checkboxOn]} />
                    <Text style={[styles.subText, st.done && styles.subDone]}>{st.text}</Text>
                  </Pressable>
                ))}
                <View style={styles.cardFooter}>
                  <Pressable onPress={() => removeGoal(goal.id)}>
                    <Text style={styles.delete}>삭제</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))
      )}

      {/* 섹션: 완료 */}
      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>진행 완료 목표</Text>
      {done.length === 0 ? (
        <Text style={styles.empty}>완료된 목표가 없어요.</Text>
      ) : (
        done.map(goal => (
          <View key={goal.id} style={[styles.card, { opacity: 0.92 }]}>
            <Pressable style={styles.cardHeader} onPress={() => toggleOpen(goal.id)}>
              <Text style={[styles.cardTitle, { textDecorationLine: 'line-through', color: '#9aa0aa' }]}>
                {goal.title}
              </Text>
              <Text style={styles.chevron}>{goal.open ? '▾' : '▸'}</Text>
            </Pressable>
            {goal.open && (
              <View style={{ marginTop: 8 }}>
                {goal.subtasks.map(st => (
                  <View key={st.id} style={styles.subRow}>
                    <View style={[styles.checkbox, styles.checkboxOn]} />
                    <Text style={[styles.subText, styles.subDone]}>{st.text}</Text>
                  </View>
                ))}
                <View style={styles.cardFooter}>
                  <Pressable onPress={() => removeGoal(goal.id)}>
                    <Text style={styles.delete}>삭제</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  /* ---------- UI ---------- */
  return (
    <View style={styles.screen}>
      <CalendarProvider date={selected} onDateChanged={setSelected}>
        <ExpandableCalendar
          markedDates={marked}
          onDayPress={(d) => setSelected(d.dateString)}
          // initialPosition="closed" // 시작을 '주' 달력으로 보고 싶으면 활성화
          firstDay={0}
          theme={{
            monthTextColor: '#111827',
            textDayFontWeight: '600',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
          }}
        />

        {/* ✅ ScrollView 대신 AgendaList 사용 → 스크롤 연동으로 캘린더 접힘 */}
        <AgendaList
          sections={sections}
          renderItem={renderContentItem}
          keyExtractor={(_, idx) => `section-item-${idx}`}
          sectionStyle={{ display: 'none' }}     // 섹션 헤더 숨김 (디자인용)
          showsVerticalScrollIndicator={false}
        />
      </CalendarProvider>

      {/* 항상 떠 있는 FAB (＋) */}
      <Pressable style={styles.fab} onPress={() => setSheetOpen(true)}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>

      {/* 항상 떠 있는 바텀 네비바 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Text style={styles.tabDot} onPress={handleGoalSetupWizard}></Text>
        </TouchableOpacity>
        <View style={styles.tabDot} />
        <View style={styles.tabDot} />
        <View style={styles.tabDot} />
      </View>

      {/* 바텀시트(신규 목표 입력) */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Pressable onPress={() => setSheetOpen(false)} hitSlop={10}>
                <Text style={styles.headerIcon}>✕</Text>
              </Pressable>
              <Text style={styles.sheetTitle}>신규</Text>
              <Pressable
                onPress={addGoal}
                hitSlop={10}
                disabled={!title.trim()}
                style={!title.trim() ? { opacity: 0.4 } : undefined}
              >
                <Text style={styles.headerIcon}>저장</Text>
              </Pressable>
            </View>

            <View style={styles.field}>
              <TextInput
                placeholder="제목"
                placeholderTextColor="#b6bcc6"
                value={title}
                onChangeText={setTitle}
                style={styles.inputSingle}
              />
            </View>
            <View style={styles.field}>
              <TextInput
                placeholder="세부사항"
                placeholderTextColor="#b6bcc6"
                value={detail}
                onChangeText={setDetail}
                style={[styles.inputMulti, { height: 110 }]}
                multiline
                textAlignVertical="top"
                maxLength={400}
              />
            </View>
            <View style={styles.field}>
              <TextInput
                placeholder="태그"
                placeholderTextColor="#b6bcc6"
                value={tag}
                onChangeText={setTag}
                style={styles.inputSingle}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* ---------- Styles ---------- */
const TAB_BAR_H = 70;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative', // FAB/BottomBar의 absolute 기준
  },

  // AgendaList 안에서 사용하는 컨텐츠 래퍼 (겹침 방지 여백)
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: TAB_BAR_H + 96, // 바텀바 + FAB 고려
  },

  sectionTitle: { marginTop: 12, marginBottom: 8, fontSize: 15, fontWeight: '700', color: '#111827' },
  empty: { color: '#9aa0aa', fontSize: 13, marginBottom: 6 },

  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e8ee',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  chevron: { fontSize: 16, color: '#525866' },

  subRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#0ea5e9' },
  checkboxOn: { backgroundColor: '#0ea5e9' },
  subText: { fontSize: 14, color: '#1f2937' },
  subDone: { textDecorationLine: 'line-through', color: '#9aa0aa' },
  cardFooter: { marginTop: 6, flexDirection: 'row', justifyContent: 'flex-end' },
  delete: { color: '#9aa0aa', fontWeight: '600', fontSize: 13 },

  /* FAB */
  fab: {
    position: 'absolute',
    right: 16,
    bottom: TAB_BAR_H + 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 10,
    zIndex: 50,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 28, fontWeight: '700' },

  /* Bottom Nav (고정) */
  bottomBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: TAB_BAR_H,
    backgroundColor: '#EFF1F5',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 40,
    elevation: 9,
  },
  tabDot: { width: 16, height: 16, borderRadius: 16, backgroundColor: '#3b5bdb' },

  /* Bottom Sheet */
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#F6F6FB',
    paddingTop: 12, paddingBottom: 24, paddingHorizontal: 16,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  headerIcon: { fontSize: 16, color: '#111827', fontWeight: '700' },
  field: { marginBottom: 12 },
  inputSingle: {
    backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#eef0f4',
  },
  inputMulti: {
    backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#eef0f4',
  },
});
