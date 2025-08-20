import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Svg, { Circle } from 'react-native-svg';
import { useSelector } from 'react-redux';
import type { RootState } from '../src/store';

type Task = {
  id: string;
  title: string;   // 목록에 보이는 제목
  detail?: string; // 세부사항
  tag?: string;    // 태그
  text?: string;   // (이전 구조 호환)
  done: boolean;
};
type TasksByDate = Record<string, Task[]>;
type ProgressByDate = Record<string, number>; // 0~1

export default function HomeScreen() {
  const name = useSelector((state: RootState) => state.user.name);

  const today = new Date().toISOString().slice(0, 10);
  const [selected, setSelected] = useState<string>(today);

  // 날짜별 투두 & 진행도(캘린더 링)
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({});
  const [progressByDate, setProgressByDate] = useState<ProgressByDate>({});

  // 바텀시트 입력 상태
  const [sheetOpen, setSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [tag, setTag] = useState('');

  const tasksForSelected = useMemo(
    () => tasksByDate[selected] ?? [],
    [tasksByDate, selected]
  );

  // ---------- AsyncStorage Load / Save ----------
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('@tasksByDate');
        const p = await AsyncStorage.getItem('@progressByDate');
        if (t) setTasksByDate(JSON.parse(t));
        if (p) setProgressByDate(JSON.parse(p));
      } catch (e) {
        console.log('load fail', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('@tasksByDate', JSON.stringify(tasksByDate));
        await AsyncStorage.setItem('@progressByDate', JSON.stringify(progressByDate));
      } catch (e) {
        console.log('save fail', e);
      }
    })();
  }, [tasksByDate, progressByDate]);

  // ---------- CRUD ----------
  const addTask = () => {
    const t = title.trim();
    if (!t) return; // 제목 필수
    const newTask: Task = {
      id: `${Date.now()}`,
      title: t,
      text: t, // (이전 구조 호환)
      detail: detail.trim(),
      tag: tag.trim(),
      done: false,
    };
    setTasksByDate(prev => ({
      ...prev,
      [selected]: [newTask, ...(prev[selected] ?? [])],
    }));
    // 입력 초기화 + 시트 닫기
    setTitle('');
    setDetail('');
    setTag('');
    setSheetOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasksByDate(prev => {
      const next = (prev[selected] ?? []).map(t => t.id === id ? { ...t, done: !t.done } : t);
      return { ...prev, [selected]: next };
    });
  };

  const removeTask = (id: string) => {
    setTasksByDate(prev => ({
      ...prev,
      [selected]: (prev[selected] ?? []).filter(t => t.id !== id),
    }));
  };

  // ---------- 진행 링 자동 계산(완료율) ----------
  useEffect(() => {
    const list = tasksByDate[selected] ?? [];
    if (list.length === 0) {
      setProgressByDate(prev => ({ ...prev, [selected]: 0 }));
      return;
    }
    const doneCount = list.filter(t => t.done).length;
    const percent = doneCount / list.length; // 0~1
    setProgressByDate(prev => ({ ...prev, [selected]: percent }));
  }, [tasksByDate, selected]);

  // ---------- 캘린더 마킹 ----------
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    Object.keys(progressByDate).forEach(date => {
      marks[date] = { marked: false };
    });
    marks[selected] = { ...(marks[selected] ?? {}), selected: true };
    return marks;
  }, [progressByDate, selected]);

  return (
    <View style={styles.container}>
      {/* 상단 아이콘 */}
      <View style={styles.topBar}>
        <Text style={styles.topBarSpacer} />
        <Image source={require('../img/search.png')} style={styles.icon} />
        <Image source={require('../img/alarm.png')} style={styles.icon} />
        <View style={styles.profileDot} />
      </View>

      <Text style={styles.greeting}>
        {name ? `${name}님 \n좋은 하루 !` : '좋은 하루!'}
      </Text>

      {/* 캘린더 카드 */}
      <View style={styles.calendarCard}>
        <Calendar
          style={{ borderRadius: 16 }}
          hideExtraDays
          onDayPress={(day) => setSelected(day.dateString)}
          markedDates={markedDates}
          theme={{
            textSectionTitleColor: '#93a0b0',
            monthTextColor: '#111827',
            textDayFontWeight: '600',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 14,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
            'stylesheet.calendar.header': {
              header: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 10,
              },
              monthText: {
                fontSize: 18,
                fontWeight: '700',
                color: '#111827',
              },
            },
          }}
          dayComponent={({ date, state }) => {
            const ds = date?.dateString ?? '';
            const isSelected = selected === ds;
            const progress = progressByDate[ds] ?? 0; // 0~1
            return (
              <Pressable
                onPress={() => setSelected(ds)}
                style={[styles.dayCell, isSelected && styles.dayCellSelected]}
              >
                <RingDay
                  day={date?.day}
                  faded={state === 'disabled'}
                  selected={isSelected}
                  progress={progress}
                />
              </Pressable>
            );
          }}
        />

        {/* 우측 플로팅 + 버튼 -> 바텀시트 오픈 */}
        <Pressable style={styles.fab} onPress={() => setSheetOpen(true)}>
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </View>

      {/* 투두 리스트 (알약형) */}
      <View style={{ marginTop: 12 }}>
        {tasksForSelected.map(item => (
          <View key={item.id} style={styles.pill}>
            <Pressable style={{ flex: 1 }} onPress={() => toggleTask(item.id)}>
              <Text
                style={[
                  styles.pillText,
                  item.done && { textDecorationLine: 'line-through', color: '#9ca3af' }
                ]}
                numberOfLines={1}
              >
                {item.title ?? item.text}
              </Text>
              {/* 필요 시 태그/세부사항 요약 */}
              {item.tag ? (
                <Text style={styles.pillTag} numberOfLines={1}>
                  #{item.tag}
                </Text>
              ) : null}
            </Pressable>
            <Pressable onPress={() => removeTask(item.id)}>
              <Text style={styles.pillDelete}>삭제</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* 하단 네비 */}
      <View style={styles.bottomBar}>
        <View style={styles.navDot} />
        <View style={styles.navDot} />
        <View style={styles.navDot} />
        <View style={styles.navDot} />
      </View>

      {/* ===== 바텀시트 모달 ===== */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        {/* 배경 딤 */}
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)} />

        {/* 시트 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            {/* 헤더 */}
            <View style={styles.sheetHeader}>
              <Pressable onPress={() => setSheetOpen(false)} hitSlop={10}>
                <Text style={styles.headerIcon}>✓</Text>
              </Pressable>
              <Text style={styles.sheetTitle}>신규</Text>
              <Pressable
                onPress={addTask}
                hitSlop={10}
                disabled={!title.trim()}
                style={!title.trim() ? { opacity: 0.4 } : undefined}
              >
                <Text style={styles.headerIcon}>＋</Text>
              </Pressable>
            </View>

            {/* 입력 필드 */}
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
                style={[styles.inputMulti, { height: 120 }]}
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

/** 원형 진행 링 + 날짜 숫자 */
function RingDay({
  day,
  progress,
  faded,
  selected,
}: {
  day?: number;
  progress: number; // 0~1
  faded?: boolean;
  selected?: boolean;
}) {
  const size = 34;      // 원 크기
  const stroke = 4;     // 링 두께
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* 회색 배경 원 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        {/* 진행 원(연두색) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#22c55e"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <Text
        style={{
          position: 'absolute',
          fontSize: 12,
          fontWeight: '700',
          color: faded ? '#c7ccd3' : '#111827',
        }}
      >
        {day}
      </Text>

      {/* 선택 강조 테두리 */}
      {selected && (
        <View
          style={{
            position: 'absolute',
            width: size + 6,
            height: size + 6,
            borderRadius: (size + 6) / 2,
            borderWidth: 2,
            borderColor: '#3b82f6',
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80 },

  // top
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 14 },
  topBarSpacer: { flex: 1 },
  icon: { width: 24, height: 24, tintColor: '#111827' },
  profileDot: { width: 28, height: 28, borderRadius: 28, backgroundColor: '#3E63AC' },

  greeting: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 16, lineHeight: 36 },

  // calendar card
  calendarCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  dayCell: { paddingVertical: 6, alignItems: 'center', justifyContent: 'center' },
  dayCellSelected: {},

  fab: {
    position: 'absolute',
    right: 10,
    bottom: -24,
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: 'white', fontSize: 22, lineHeight: 22, fontWeight: '600' },

  // pill todos
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    gap: 14,
  },
  pillText: { fontSize: 16, fontWeight: '700', color: '#111827' },
  pillTag: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  pillDelete: { color: '#9ca3af', fontWeight: '600' },

  // bottom nav
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    height: 72,
    backgroundColor: '#EFF1F5',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navDot: { width: 18, height: 18, borderRadius: 18, backgroundColor: '#3b5bdb' },

  // modal / sheet
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#F6F6FB',
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  headerIcon: { fontSize: 20, color: '#111827', fontWeight: '700' },

  field: { marginBottom: 12 },
  inputSingle: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#eef0f4',
  },
  inputMulti: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#eef0f4',
  },
});
