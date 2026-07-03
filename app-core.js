// Ser Ativo Home Basic — App principal
// Escrito em React.createElement puro (sem JSX/Babel) para máxima compatibilidade
"use strict";

const h = React.createElement;
const { useState, useEffect, useRef } = React;

// ── CONSTANTES ────────────────────────────────────────────────────────────
const COLORS = {
  blue: "#1E5EFF",
  blueLight: "#E8EFFE",
  blueMid: "#4A7CFF",
  green: "#57C84D",
  greenLight: "#EAFAE8",
  white: "#FFFFFF",
  gray: "#F4F6FA",
  grayMid: "#E2E6F0",
  grayText: "#8896B3",
  dark: "#1A2340",
  darkMid: "#3D4F72",
  orange: "#FF8C42",
  yellow: "#FFD166",
  red: "#FF4757",
};

const FONT_TITLE = "Poppins, sans-serif";
const FONT_TEXT = "Inter, sans-serif";

const DEFAULT_VIDEOS = {
  "A-1": "", "A-2": "", "A-3": "", "A-4": "",
  "A-5": "", "A-6": "", "A-7": "", "A-8": "",
  "B-1": "", "B-2": "", "B-3": "", "B-4": "",
  "B-5": "", "B-6": "", "B-7": "", "B-8": "",
};

function getYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const TREINO_A = [
  { id: 1, nome: "Agachamento livre", series: 3, reps: "12", descanso: "60s", musculo: "Quadríceps / Glúteos", emoji: "🦵" },
  { id: 2, nome: "Extensão de joelho na cadeira", series: 3, reps: "12", descanso: "60s", musculo: "Quadríceps", emoji: "🦿" },
  { id: 3, nome: "Flexão de joelho em pé", series: 3, reps: "12", descanso: "60s", musculo: "Isquiotibiais", emoji: "🦵" },
  { id: 4, nome: "Elevação de panturrilha", series: 3, reps: "15", descanso: "45s", musculo: "Panturrilha", emoji: "👣" },
  { id: 5, nome: "Abdominal crunch", series: 3, reps: "15", descanso: "45s", musculo: "Core", emoji: "💪" },
  { id: 6, nome: "Prancha frontal", series: 3, reps: "30s", descanso: "45s", musculo: "Core / Estabilização", emoji: "🧘" },
  { id: 7, nome: "Ponte glúteo", series: 3, reps: "15", descanso: "45s", musculo: "Glúteos / Core", emoji: "🏋️" },
  { id: 8, nome: "Marcha estacionária", series: 2, reps: "1 min", descanso: "30s", musculo: "Cardiovascular", emoji: "🚶" },
];

const TREINO_B = [
  { id: 1, nome: "Flexão de braços (adaptada)", series: 3, reps: "10", descanso: "60s", musculo: "Peitoral / Tríceps", emoji: "💪" },
  { id: 2, nome: "Remada com elástico", series: 3, reps: "12", descanso: "60s", musculo: "Dorsais / Bíceps", emoji: "🏋️" },
  { id: 3, nome: "Elevação lateral com elástico", series: 3, reps: "12", descanso: "60s", musculo: "Deltoides", emoji: "🤸" },
  { id: 4, nome: "Rosca direta com elástico", series: 3, reps: "12", descanso: "60s", musculo: "Bíceps", emoji: "💪" },
  { id: 5, nome: "Extensão de tríceps", series: 3, reps: "12", descanso: "60s", musculo: "Tríceps", emoji: "🦾" },
  { id: 6, nome: "Agachamento com elevação de braços", series: 3, reps: "12", descanso: "60s", musculo: "Corpo total", emoji: "🙆" },
  { id: 7, nome: "Abdominal oblíquo", series: 3, reps: "12 cada lado", descanso: "45s", musculo: "Core / Oblíquos", emoji: "🧘" },
  { id: 8, nome: "Alongamento geral", series: 1, reps: "5 min", descanso: "—", musculo: "Recuperação", emoji: "🌿" },
];

const SESSIONS = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  tipo: i % 2 === 0 ? "A" : "B",
  duracao: i % 2 === 0 ? "35 min" : "40 min",
  borgAlvo: i < 8 ? "3–4" : i < 16 ? "4–5" : i < 24 ? "5–6" : "6–7",
  semana: Math.floor(i / 4) + 1,
}));

const BORG_SCALE = [
  { val: 0, label: "Repouso", color: "#57C84D", emoji: "😴" },
  { val: 1, label: "Muito leve", color: "#7ED957", emoji: "😌" },
  { val: 2, label: "Muito leve", color: "#A8E063", emoji: "😊" },
  { val: 3, label: "Leve", color: "#C8E86B", emoji: "🙂" },
  { val: 4, label: "Leve", color: "#E8E873", emoji: "😃" },
  { val: 5, label: "Moderado", color: "#F5D060", emoji: "😤" },
  { val: 6, label: "Moderado", color: "#F5B840", emoji: "😰" },
  { val: 7, label: "Intenso", color: "#F5963A", emoji: "😓" },
  { val: 8, label: "Intenso", color: "#F07030", emoji: "😖" },
  { val: 9, label: "Muito intenso", color: "#E04520", emoji: "😩" },
  { val: 10, label: "Muito intenso", color: "#CC2010", emoji: "🥵" },
];

const AVATARS = ["👩", "👨", "👵", "👴", "🧑", "👩‍🦳", "👨‍🦳", "👩‍🦱", "👨‍🦱"];

// ── COMPONENTES COMPARTILHADOS ───────────────────────────────────────────

function Logo(props) {
  const size = (props && props.size) || 48;
  return h("div", {
    style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }
  },
    h("div", {
      style: {
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueMid} 50%, ${COLORS.green} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 8px 24px ${COLORS.blue}40`,
      }
    },
      h("svg", { width: size * 0.55, height: size * 0.55, viewBox: "0 0 32 32", fill: "none" },
        h("path", { d: "M8 22 L14 10 L20 16 L26 8", stroke: "white", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }),
        h("circle", { cx: "16", cy: "6", r: "3", fill: "white", fillOpacity: "0.8" }),
        h("path", { d: "M12 26 Q16 22 20 26", stroke: "white", strokeWidth: "2", strokeLinecap: "round", fill: "none" })
      )
    )
  );
}

function BottomNav({ active, setScreen }) {
  const tabs = [
    { key: "home", icon: "🏠", label: "Início" },
    { key: "sessions", icon: "📋", label: "Sessões" },
    { key: "progress", icon: "📈", label: "Progresso" },
    { key: "profile", icon: "👤", label: "Perfil" },
  ];
  return h("div", {
    style: {
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 480, background: COLORS.white,
      borderTop: `1px solid ${COLORS.grayMid}`,
      display: "flex", padding: "10px 0 20px",
      boxShadow: "0 -4px 20px rgba(30,94,255,0.08)",
      zIndex: 100,
    }
  },
    tabs.map(t => h("button", {
      key: t.key,
      onClick: () => setScreen(t.key),
      style: {
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        background: "none", border: "none", cursor: "pointer", padding: "4px 0",
      }
    },
      h("span", { style: { fontSize: 20 } }, t.icon),
      h("span", {
        style: {
          fontSize: 10, fontWeight: active === t.key ? 700 : 400,
          color: active === t.key ? COLORS.blue : COLORS.grayText,
          fontFamily: FONT_TEXT,
        }
      }, t.label),
      active === t.key ? h("div", {
        style: { width: 20, height: 3, borderRadius: 2, background: COLORS.blue, marginTop: 1 }
      }) : null
    ))
  );
}

// ── VIDEO MODAL ───────────────────────────────────────────────────────────

function VideoModal({ videoUrl, exerciseName, onClose }) {
  const videoId = getYoutubeId(videoUrl);
  return h("div", {
    style: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 999, padding: 20,
    },
    onClick: onClose,
  },
    h("div", {
      style: { width: "100%", maxWidth: 370, background: COLORS.dark, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" },
      onClick: (e) => e.stopPropagation(),
    },
      h("div", {
        style: { padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)" }
      },
        h("div", null,
          h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT, textTransform: "uppercase", letterSpacing: 1 } }, "Vídeo demonstrativo"),
          h("div", { style: { fontSize: 15, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE } }, exerciseName)
        ),
        h("button", {
          onClick: onClose,
          style: { background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, width: 34, height: 34, color: COLORS.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
        }, "✕")
      ),
      videoId
        ? h("div", { style: { position: "relative", paddingBottom: "56.25%", height: 0 } },
            h("iframe", {
              src: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
              style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" },
              allow: "autoplay; encrypted-media",
              allowFullScreen: true,
            })
          )
        : h("div", { style: { padding: "40px 20px", textAlign: "center" } },
            h("div", { style: { fontSize: 40, marginBottom: 12 } }, "🎬"),
            h("div", { style: { fontSize: 14, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "Vídeo não disponível")
          ),
      h("div", { style: { padding: "12px 20px" } },
        h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT, textAlign: "center" } }, "Assista com atenção antes de executar o exercício")
      )
    )
  );
}

// Cópias imutáveis dos treinos originais (para botão "Redefinir")
const TREINO_A_DEFAULT = TREINO_A.map(e => Object.assign({}, e));
const TREINO_B_DEFAULT = TREINO_B.map(e => Object.assign({}, e));

// Export to global scope (loaded by other script files in order)
window.SerAtivo = window.SerAtivo || {};
Object.assign(window.SerAtivo, {
  h, useState, useEffect, useRef,
  COLORS, FONT_TITLE, FONT_TEXT,
  DEFAULT_VIDEOS, getYoutubeId,
  TREINO_A, TREINO_B, TREINO_A_DEFAULT, TREINO_B_DEFAULT,
  SESSIONS, BORG_SCALE, AVATARS,
  Logo, BottomNav, VideoModal,
});
