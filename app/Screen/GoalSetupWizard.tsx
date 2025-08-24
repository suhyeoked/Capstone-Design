import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    UIManager,
    View
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ---------- Types ---------- */
type WeekKey = '일'|'월'|'화'|'수'|'목'|'금'|'토';

type SubTask = { id: string; text: string; done: boolean };
type Goal = {
  id: string;
  date: string;
  title: string;
  subtasks: SubTask[];
  status: 'ongoing' | 'done';
  open?: boolean;
};

type RootStackParamList = {
  Home: { newGoal?: Goal };
  Main: undefined;
  GoalSetupWizard: undefined;
};

type NavProp = NativeStackNavigationProp<RootStackParamList, 'GoalSetupWizard'>;

/* ---------- Component ---------- */
export default function GoalSetupWizard({ defaultTitle = '' }: { defaultTitle?: string }) {
  const navigation = useNavigation<NavProp>();
  const [step, setStep] = useState<1|2|3|4>(1);

  const [title, setTitle] = useState(defaultTitle);
  const [pickedSuggestion, setPickedSuggestion] = useState<string | undefined>();
  const [days, setDays] = useState<WeekKey[]>(['월','수','금']);
  const [hour, setHour] = useState(15);
  const [minute, setMinute] = useState(30);

  /* ----- 추천 ----- */
  const suggestions = useMemo(() => {
    const base = title?.trim() || '영어 회화';
    return [
      `${base} 20분`,
      `${base} 유튜브 시청하기`,
      `${base} 일기쓰기`,
      `${base} 리스닝 듣기`,
    ];
  }, [title]);

  /* ----- 완료 처리 ----- */
  const handleComplete = () => {
    if (!title.trim()) return;
    const now = Date.now();
    const newGoal: Goal = {
      id: `${now}`,
      date: new Date().toISOString().slice(0, 10),
      title: title.trim(),
      status: 'ongoing',
      open: true,
      subtasks: [
        { id: `${now}-1`, text: pickedSuggestion || `${title.trim()} 하위 작업`, done: false },
      ],
    };

    // ✅ HomeScreen으로 이동하면서 newGoal 전달
    navigation.navigate('Home', { newGoal });
  };

  /* ----- 스텝 이동 ----- */
  const canNext = useMemo(() => {
    if (step === 1) return title.trim().length > 0;
    if (step === 2) return true;
    if (step === 3) return days.length > 0;
    return true;
  }, [step, title, days]);

  const goNext = () => {
    if (!canNext) return;
    if (step < 4) {
      LayoutAnimation.easeInEaseOut();
      setStep((s) => (s + 1) as any);
    } else {
      handleComplete(); // ✅ 마지막 단계에서 목표 저장
    }
  };

  const goPrev = () => {
    if (step === 1) {
      navigation.navigate('Home'); // ✅ 첫단계에서 뒤로 → Main 이동
      return;
    }
    LayoutAnimation.easeInEaseOut();
    setStep((s) => (s - 1) as any);
  };

  const toggleDay = (d: WeekKey) => {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  return (
    <View style={styles.screen}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={goPrev} hitSlop={10}>
          <Text style={styles.navIcon}>〈</Text>
        </Pressable>
        <Text style={styles.headerTitle}>목표 설정</Text>
        <Pressable onPress={() => navigation.navigate('Main')} hitSlop={10}>
          <Text style={styles.navIcon}>✕</Text>
        </Pressable>
      </View>

      {/* 스텝 인디케이터 */}
      <View style={styles.steps}>
        {[1,2,3,4].map(i => (
          <View key={i} style={[styles.dot, step>=i && styles.dotOn]} />
        ))}
      </View>

      {/* 본문 */}
      <View style={styles.body}>
        {step === 1 && (
          <>
            <Text style={styles.title}>목표를 설정해 볼까요?</Text>
            <Text style={styles.desc}>그냥 하고 싶은 걸 적어주세요!{"\n"}나만의 도트맵 목표로 💪</Text>

            <View style={styles.inputWrap}>
              <TextInput
                placeholder="예) 영어 회화 마스터"
                placeholderTextColor="#b6bcc6"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>AI가 구체화한 목표예요!</Text>
            <Text style={styles.desc}>당신의 목표를 이렇게 구체화했어요.{"\n"}마음에 드는 걸 골라볼까요? 💪</Text>

            <View style={{ gap: 10, marginTop: 8 }}>
              {suggestions.map((sug, idx) => {
                const active = pickedSuggestion === sug;
                return (
                  <Pressable
                    key={idx}
                    onPress={()=> setPickedSuggestion(active ? undefined : sug)}
                    style={[styles.sugItem, active && styles.sugItemOn]}
                  >
                    <Text style={[styles.sugText, active && styles.sugTextOn]}>{sug}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={()=> setPickedSuggestion(undefined)}
                style={[styles.sugItem, { backgroundColor: '#f5f7fb', borderColor: '#e7eaf1' }]}
              >
                <Text style={[styles.sugText, { color:'#5b6472' }]}>더 추천해 주세요</Text>
              </Pressable>
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>요일을 선택해 볼까요?</Text>
            <Text style={styles.desc}>처음엔 2~3개만 선택해도 좋아요.{"\n"}중요한 건 시작이에요 💪</Text>

            <View style={styles.weekRow}>
              {['일','월','화','수','목','금','토'].map(d => {
                const active = days.includes(d as WeekKey);
                return (
                  <Pressable
                    key={d}
                    onPress={()=>toggleDay(d as WeekKey)}
                    style={[styles.dayChip, active && styles.dayChipOn]}
                  >
                    <Text style={[styles.dayText, active && styles.dayTextOn]}>{d}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>알림은 언제가 좋은가요?</Text>
            <Text style={styles.desc}>목표를 잊지 않도록!{"\n"}원하는 시간에 알려드릴게요 ✨</Text>

            <View style={styles.timeRow}>
              <Stepper label="시" value={hour} onInc={()=>setHour((h)=>(h+1)%24)} onDec={()=>setHour((h)=>(h+23)%24)} />
              <Text style={styles.colon}>:</Text>
              <Stepper label="분" value={minute} onInc={()=>setMinute((m)=>(m+5)%60)} onDec={()=>setMinute((m)=>(m+55)%60)} />
            </View>

            <Text style={styles.tip}>너무 자주 울리면 부담되니, 적당한 시간으로 정하는 걸 추천해요!</Text>
          </>
        )}
      </View>

      {/* 하단 버튼 */}
      <Pressable
        style={[styles.bottomBtn, !canNext && { opacity: 0.5 }]}
        disabled={!canNext}
        onPress={goNext}
      >
        <Text style={styles.bottomBtnText}>
          {step === 4 ? '작성 완료' : '다음'}
        </Text>
      </Pressable>
    </View>
  );
}

/* ------- 작은 컴포넌트: 스텝퍼 ------- */
function Stepper({
  label, value, onInc, onDec,
}: { label: string; value: number; onInc: () => void; onDec: () => void }) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperBox}>
        <Pressable onPress={onDec} style={styles.stepperBtn}><Text style={styles.stepperBtnTxt}>-</Text></Pressable>
        <Text style={styles.stepperValue}>{String(value).padStart(2,'0')}</Text>
        <Pressable onPress={onInc} style={styles.stepperBtn}><Text style={styles.stepperBtnTxt}>＋</Text></Pressable>
      </View>
    </View>
  );
}

/* -------------------- styles -------------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navIcon: { fontSize: 18, color: '#111827', fontWeight: '700' },
  headerTitle: { fontSize: 14, fontWeight: '700', color: '#6b7280' },

  steps: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#e6e8ee' },
  dotOn: { backgroundColor: '#5865f2' },

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 6 },

  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 2 },
  desc: { color: '#6b7280', marginTop: 8, lineHeight: 20 },

  inputWrap: {
    marginTop: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e6e8ee', backgroundColor: '#fafbff',
  },
  input: { paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: '#111827' },

  sugItem: {
    borderRadius: 12, borderWidth: 1, borderColor: '#dfe3ec',
    backgroundColor: '#eef1f9', paddingVertical: 14, paddingHorizontal: 14,
  },
  sugItemOn: { backgroundColor: '#3b5bdb' },
  sugText: { fontSize: 15, color: '#111827', fontWeight: '700' },
  sugTextOn: { color: 'white' },

  weekRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  dayChip: {
    minWidth: 40, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, borderColor: '#dfe3ec', backgroundColor: '#f5f7fb', alignItems: 'center',
  },
  dayChipOn: { backgroundColor: '#111827', borderColor: '#111827' },
  dayText: { color: '#4b5563', fontWeight: '700' },
  dayTextOn: { color: 'white' },

  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  colon: { fontSize: 26, fontWeight: '800', color: '#111827' },

  stepper: {},
  stepperLabel: { color: '#6b7280', marginBottom: 8, fontWeight: '700' },
  stepperBox: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 12, borderWidth: 1, borderColor: '#e6e8ee', paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: '#fafbff',
  },
  stepperBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#111827',
    alignItems: 'center', justifyContent: 'center',
  },
  stepperBtnTxt: { color: 'white', fontSize: 18, fontWeight: '800' },
  stepperValue: { fontSize: 22, fontWeight: '800', color: '#111827', width: 36, textAlign: 'center' },

  tip: { color: '#8b93a1', fontSize: 12, marginTop: 10 },

  bottomBtn: {
    marginHorizontal: 16, marginBottom: 16, borderRadius: 14, height: 52,
    backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  bottomBtnText: { color: 'white', fontSize: 16, fontWeight: '800' },
});
