import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =====================
// Config & Constants
// =====================
const LS_KEYS = {
  physAge: "physAge",
  weightKg: "weightKg",
  heightCm: "heightCm",
  questions: "questions",
  answers: "answers",
  score: "score",
  current: "current",
};

// Illustration keys for guaranteed visuals (emoji-only)
const ILLU_KEYS = {
  activity: "activity",
  sleep: "sleep",
  night_wake: "night_wake",
  work: "work",
  diabetes: "diabetes",
  blood_pressure: "blood_pressure",
  smoke: "smoke",
  alcohol: "alcohol",
  diet: "diet",
  supplements: "supplements",
  exercise: "exercise",
  illness: "illness",
  energy: "energy",
  drowsy: "drowsy",
  focus: "focus",
};

// Short labels for binary-type risks
const factorShortLabels = {
  diabetes: "Diabetes",
  blood_pressure: "High blood pressure",
  smoke: "Smoking",
  alcohol: "Alcohol consumption",
};

// =====================
// Default Questions (same as your table)
// =====================
const defaultQuestions = [
  { question: "How active you are", key: ILLU_KEYS.activity, choices: [
      { text: "Low", score: 2 },
      { text: "Moderate", score: 1 },
      { text: "High", score: 0 },
  ]},
  { question: "How many hrs you sleep", key: ILLU_KEYS.sleep, choices: [
      { text: "<7", score: 2 },
      { text: "7-9", score: 0 },
      { text: ">9", score: 2 },
  ]},
  { question: "How frequently do you get up during night", key: ILLU_KEYS.night_wake, choices: [
      { text: "Don’t get up", score: 0 },
      { text: "Once", score: 1 },
      { text: "2-3 times", score: 2 },
      { text: "More than 3 times", score: 3 },
  ]},
  { question: "In general, which work behavior you relate most to", key: ILLU_KEYS.work, choices: [
      { text: "Calm and steady, motivated to achieve goals", score: 0 },
      { text: "Irritable or anxious, trouble focussing, less motivated", score: 1 },
      { text: "Out of control, unable to focus", score: 2 },
  ]},
  { question: "Do you have diabetes", key: ILLU_KEYS.diabetes, choices: [
      { text: "No", score: 0 },
      { text: "Yes", score: 5 },
      { text: "Don’t Know", score: 2 },
  ]},
  { question: "Do you have high blood pressure", key: ILLU_KEYS.blood_pressure, choices: [
      { text: "No", score: 0 },
      { text: "Yes", score: 5 },
      { text: "Don’t Know", score: 2 },
  ]},
  { question: "Do you smoke", key: ILLU_KEYS.smoke, choices: [
      { text: "Yes", score: 5 },
      { text: "No", score: 0 },
      { text: "Occasionally", score: 3 },
  ]},
  { question: "Do you consume alcohol", key: ILLU_KEYS.alcohol, choices: [
      { text: "Yes", score: 3 },
      { text: "No", score: 0 },
      { text: "Occasionally", score: 1 },
  ]},
  { question: "Which dietary pattern you most relate to", key: ILLU_KEYS.diet, choices: [
      { text: "Strict diet", score: 0 },
      { text: "Regulated diet", score: 1 },
      { text: "Unregulated diet", score: 2 },
      { text: "Irregular", score: 3 },
  ]},
  { question: "Do you regularly take supplements", key: ILLU_KEYS.supplements, choices: [
      { text: "Yes", score: 0 },
      { text: "No", score: 0 },
  ]},
  { question: "How often do you exercise", key: ILLU_KEYS.exercise, choices: [
      { text: "Don’t exercise at all", score: -3 },
      { text: "<75 min per week", score: -2 },
      { text: "75-150 min per week", score: -1 },
      { text: ">150 min a week", score: 0 },
  ]},
  { question: "How often do you fall ill", key: ILLU_KEYS.illness, choices: [
      { text: "Rarely", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Frequently", score: 2 },
  ]},
  { question: "How energetic you feel throughout the day", key: ILLU_KEYS.energy, choices: [
      { text: "Very high energy throughout till bed time", score: 0 },
      { text: "High in spurts (morning / evening), tired otherwise", score: 1 },
      { text: "Tired throughout the day", score: 2 },
  ]},
  { question: "Do you feel drowsy even after your regular sleep", key: ILLU_KEYS.drowsy, choices: [
      { text: "Yes", score: 3 },
      { text: "No", score: 0 },
      { text: "Sometimes", score: 1 },
      { text: "Often", score: 2 },
  ]},
  { question: "How difficult it is for you to concentrate for more than 15 min on one task", key: ILLU_KEYS.focus, choices: [
      { text: "Extremely difficult", score: 2 },
      { text: "Moderately difficult", score: 1 },
      { text: "Not difficult at all", score: 0 },
  ]},
];

// =====================
// Helpers
// =====================
function Illustration({ keyName }) {
  const map = {
    activity: { emoji: "🏃", label: "Activity" },
    sleep: { emoji: "😴", label: "Sleep" },
    night_wake: { emoji: "🌙", label: "Night wake" },
    work: { emoji: "🧠", label: "Work focus" },
    diabetes: { emoji: "🩸", label: "Diabetes" },
    blood_pressure: { emoji: "❤️", label: "Blood pressure" },
    smoke: { emoji: "🚭", label: "Smoking" },
    alcohol: { emoji: "🍷", label: "Alcohol" },
    diet: { emoji: "🥗", label: "Diet" },
    supplements: { emoji: "💊", label: "Supplements" },
    exercise: { emoji: "🏋️", label: "Exercise" },
    illness: { emoji: "🤒", label: "Illness" },
    energy: { emoji: "⚡", label: "Energy" },
    drowsy: { emoji: "🥱", label: "Drowsy" },
    focus: { emoji: "🎯", label: "Focus" },
  };
  const item = map[keyName] || { emoji: "❓", label: "Health" };
  return (
    <div className="h-56 w-full bg-gradient-to-br from-red-50 to-white flex items-center justify-center relative select-none">
      <div className="text-[64px]">{item.emoji}</div>
      <div className="absolute bottom-2 right-2 text-xs text-red-500/70">{item.label}</div>
    </div>
  );
}

function getTopFactors(questionsArr, answersObj) {
  const out = [];
  for (let i = 0; i < questionsArr.length; i++) {
    const q = questionsArr[i];
    const idx = answersObj[i];
    if (idx == null) continue;
    const choice = q.choices[idx];
    if (choice && choice.score > 0) {
      const label = factorShortLabels[q.key] || choice.text;
      out.push({ label, score: choice.score });
    }
  }
  return out.sort((a,b)=>b.score-a.score).slice(0,3);
}

function getRecommendations(questionsArr, answersObj) {
  const tipsMap = {
    activity: "Move daily; aim for 150+ minutes/week.",
    sleep: "Sleep 7–9 hours on a consistent schedule.",
    night_wake: "Avoid late caffeine; keep your room cool and dark.",
    work: "Use breaks, breathing, and time-blocking to manage stress.",
    diabetes: "Monitor glucose and follow a fiber-rich diet.",
    blood_pressure: "Reduce sodium and manage stress.",
    smoke: "Quit smoking; seek cessation support.",
    alcohol: "Keep alcohol minimal.",
    diet: "Eat mostly whole foods; limit processed foods.",
    exercise: "Add regular strength & cardio workouts.",
    energy: "Prioritize sleep and hydration.",
  };
  const seen = {};
  const tips = [];
  for (let i=0;i<questionsArr.length;i++){
    const q=questionsArr[i];
    const idx=answersObj[i];
    const c=q.choices[idx];
    if(c && c.score>0 && tipsMap[q.key] && !seen[q.key]) {
      tips.push(tipsMap[q.key]);
      seen[q.key]=true;
    }
  }
  return tips.slice(0,6);
}

function getSummary(diff) {
  if (diff <= -5) return { text: `Your biological age is ${Math.abs(diff)} years lower — excellent!`, emoji: "💪😊" };
  if (diff <= 0) return { text: "Your biological age matches your physiological age — great balance!", emoji: "😄👍" };
  if (diff <= 5) return { text: `Your biological age is ${diff} years higher — minor tweaks can help.`, emoji: "🙂" };
  if (diff <= 10) return { text: `Your biological age is ${diff} years higher — improve sleep, diet, and exercise.`, emoji: "⚠️😕" };
  if (diff <= 20) return { text: `Your biological age is ${diff} years higher — take proactive steps.`, emoji: "🚨😟" };
  return { text: `Your biological age is ${diff} years higher — consult a professional.`, emoji: "💀⚡" };
}

// =====================
// Component
// =====================
export default function PlayfulBacIndexQuiz() {
  // Steps
  const [step, setStep] = useState(1);

  // Step 1 – Contact info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");

  // Step 2 – Physical info
  const [physAge, setPhysAge] = useState(30);
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(170);

  const bmi = useMemo(() => {
    const h = heightCm / 100;
    return h ? Number((weightKg / (h * h)).toFixed(1)) : 0;
  }, [heightCm, weightKg]);

  // Step 3 – Questions
  const [questions] = useState(defaultQuestions);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  // Step 4 – Result
  const [bioAge, setBioAge] = useState(null);
  const [diff, setDiff] = useState(null);
  const [summary, setSummary] = useState({});
  const [emailStatus, setEmailStatus] = useState("");

  // Navigation
  function goToStep(n) {
    setStep(n);
    window.scrollTo(0, 0);
  }

  // Quiz controls
  const totalQs = questions.length;
  const progress = totalQs ? Math.round(((current + (answers[current] != null ? 1 : 0)) / totalQs) * 100) : 0;
  const slideProps = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 }, transition: { duration: 0.22 } };

  function choose(ci) {
    setAnswers((prev) => ({ ...prev, [current]: ci }));
    setTimeout(() => {
      if (current < totalQs - 1) setCurrent((c) => c + 1);
    }, 180);
  }

  async function finishQuiz() {
    const total = questions.reduce((acc, q, i) => {
      const idx = answers[i];
      const ch = q.choices[idx];
      return acc + (ch ? Number(ch.score) || 0 : 0);
    }, 0);
    setScore(total);
    const bio = Number(physAge) + total;
    const d = bio - Number(physAge);
    setBioAge(bio);
    setDiff(d);
    setSummary(getSummary(d));
    setStep(4);

    // send email
    try {
      const res = await fetch("/api/send-result-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, company, designation,
          physAge, weightKg, heightCm, bmi,
          score: total, bioAge: bio, diff: d,
          topFactors: getTopFactors(questions, answers),
          recommendations: getRecommendations(questions, answers),
        }),
      });
      if (!res.ok) throw new Error("Failed to send email");
      setEmailStatus("Email sent successfully ✅");
    } catch (e) {
      setEmailStatus("Could not send email ❌");
    }
  }

  const currentQ = questions[current];

  return (
    <div className="min-h-screen bg-white text-red-800">
      <div className="max-w-3xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold">❤️ BAC Index Quiz</h1>
          <div className="text-sm">Auto-save · Step {step}/4</div>
        </header>

        {/* Step 1 */}
        {step === 1 && (
          <motion.div className="rounded-2xl border border-red-200 bg-white p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Step 1: Your Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="border rounded p-2" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
              <input className="border rounded p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
              <input className="border rounded p-2" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
              <input className="border rounded p-2" placeholder="Company" value={company} onChange={e=>setCompany(e.target.value)} />
              <input className="border rounded p-2" placeholder="Designation" value={designation} onChange={e=>setDesignation(e.target.value)} />
            </div>
            <div className="mt-6 flex justify-end">
              <button disabled={!name || !email} onClick={()=>goToStep(2)} className="px-5 py-2 bg-red-600 text-white rounded-lg">Continue ▶</button>
            </div>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div className="rounded-2xl border border-red-200 bg-white p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Step 2: Physical Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label>Age
                <input type="number" className="border rounded p-2 w-full" value={physAge} onChange={e=>setPhysAge(Number(e.target.value))}/>
              </label>
              <label>Weight (kg)
                <input type="number" className="border rounded p-2 w-full" value={weightKg} onChange={e=>setWeightKg(Number(e.target.value))}/>
              </label>
              <label>Height (cm)
                <input type="number" className="border rounded p-2 w-full" value={heightCm} onChange={e=>setHeightCm(Number(e.target.value))}/>
              </label>
            </div>
            <div className="mt-3 text-sm">BMI: <strong>{bmi}</strong></div>
            <div className="mt-6 flex justify-between">
              <button onClick={()=>goToStep(1)} className="border px-4 py-2 rounded">⬅ Back</button>
              <button onClick={()=>goToStep(3)} className="px-5 py-2 bg-red-600 text-white rounded-lg">Start Quiz ▶</button>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 sm:p-6 shadow">
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Question {current + 1} / {totalQs}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-red-100 rounded-full">
                <div className="h-2 bg-red-600" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={current} {...slideProps} className="grid gap-4 sm:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-red-200">
                  <Illustration keyName={currentQ.key} />
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-3">{current + 1}. {currentQ.question}</h2>
                  <div className="space-y-2">
                    {currentQ.choices.map((c, ci) => {
                      const selected = answers[current] === ci;
                      const className = selected
                        ? "w-full text-left p-3 rounded-xl border border-red-500 bg-red-50"
                        : "w-full text-left p-3 rounded-xl border border-red-200 hover:bg-red-50";
                      return (
                        <button key={ci} onClick={()=>choose(ci)} className={className}>{c.text}</button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 flex items-center justify-between">
              <button onClick={()=>setCurrent(Math.max(0,current-1))} disabled={current===0} className="px-4 py-2 border rounded-lg">⬅ Prev</button>
              {current < totalQs - 1 ? (
                <button onClick={()=>setCurrent(Math.min(totalQs-1,current+1))} disabled={answers[current]==null} className="px-5 py-2 bg-red-600 text-white rounded-lg">Next ➡</button>
              ) : (
                <button onClick={finishQuiz} disabled={answers[current]==null} className="px-5 py-2 bg-red-600 text-white rounded-lg">Finish ✅</button>
              )}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <motion.div className="rounded-2xl border border-red-200 bg-white p-6 shadow">
            <h2 className="text-2xl font-bold mb-4">Your Results</h2>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
              <p>Physiological Age: <strong>{physAge} yrs</strong></p>
              <p>Biological Age: <strong>{bioAge} yrs</strong></p>
              <p>Difference: <strong className={diff>0?"text-red-700":"text-green-700"}>{diff>0?`+${diff}`:diff}</strong> years</p>
              <p className="mt-2 text-sm text-red-700 font-medium">{summary.text} {summary.emoji}</p>
            </div>
            <div className="mb-3">
              <h3 className="font-semibold text-red-700 mb-2">Top Factors</h3>
              <ul className="list-disc pl-5">
                {getTopFactors(questions, answers).map((t,i)=>(<li key={i}>{t.label}</li>))}
              </ul>
            </div>
            <div className="mb-3">
              <h3 className="font-semibold text-red-700 mb-2">Recommendations</h3>
              <ul className="list-disc pl-5">
                {getRecommendations(questions, answers).map((r,i)=>(<li key={i}>{r}</li>))}
              </ul>
            </div>
            <div className="text-sm text-gray-500">{emailStatus}</div>
            <div className="mt-5 flex gap-3">
              <button onClick={()=>goToStep(3)} className="border px-4 py-2 rounded-lg">🔁 Review</button>
              <button onClick={()=>window.print()} className="border px-4 py-2 rounded-lg">🖨️ Print</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
