// Ser Ativo Home Basic — Gerenciador de Vídeos + App Principal
"use strict";

(function () {
  const S = window.SerAtivo;
  const h = S.h, useState = S.useState;
  const COLORS = S.COLORS, FONT_TITLE = S.FONT_TITLE, FONT_TEXT = S.FONT_TEXT;
  const TREINO_A = S.TREINO_A, TREINO_B = S.TREINO_B, getYoutubeId = S.getYoutubeId;

  function VideoManagerScreen({ setScreen, videos, setVideos }) {
    const [draft, setDraft] = useState(Object.assign({}, videos));
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("A");

    const exercises = activeTab === "A" ? TREINO_A : TREINO_B;

    function save() {
      setVideos(Object.assign({}, draft));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }

    return h("div", { style: { background: COLORS.white, minHeight: "100vh", paddingBottom: 40 } },
      h("div", { style: { background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" } },
        h("button", {
          onClick: () => setScreen("profile"),
          style: { background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 14px", color: COLORS.white, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: FONT_TEXT }
        }, "← Voltar"),
        h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE, marginBottom: 4 } }, "🎬 Vídeos dos Exercícios"),
        h("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: FONT_TEXT } }, "Cole o link do YouTube para cada exercício")
      ),

      h("div", { style: { padding: "20px 20px 0" } },
        h("div", { style: { background: COLORS.blueLight, borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" } },
          h("span", { style: { fontSize: 18, flexShrink: 0 } }, "💡"),
          h("div", { style: { fontSize: 12, color: COLORS.blue, fontFamily: FONT_TEXT, lineHeight: 1.5 } },
            "Cole qualquer link do YouTube (youtu.be, youtube.com/watch, Shorts). O vídeo abrirá direto no app para o paciente assistir.")
        ),

        h("div", { style: { display: "flex", background: COLORS.gray, borderRadius: 14, padding: 4, marginBottom: 20, gap: 4 } },
          ["A", "B"].map(t => h("button", {
            key: t,
            onClick: () => setActiveTab(t),
            style: {
              flex: 1, padding: "12px", border: "none", borderRadius: 11, cursor: "pointer",
              background: activeTab === t ? COLORS.white : "transparent",
              color: activeTab === t ? COLORS.blue : COLORS.grayText,
              fontSize: 14, fontWeight: activeTab === t ? 700 : 400,
              fontFamily: FONT_TITLE,
              boxShadow: activeTab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s",
            }
          }, `Treino ${t}${activeTab === t ? (t === "A" ? " · Inf. + Core" : " · Sup. + Total") : ""}`))
        ),

        h("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 } },
          exercises.map(ex => {
            const key = `${activeTab}-${ex.id}`;
            const videoId = getYoutubeId(draft[key]);
            return h("div", {
              key: key,
              style: { background: COLORS.white, borderRadius: 18, padding: "16px", border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }
            },
              h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 } },
                h("div", { style: { width: 36, height: 36, background: COLORS.gray, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 } }, ex.emoji),
                h("div", { style: { flex: 1, minWidth: 0 } },
                  h("div", { style: { fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: FONT_TITLE } }, ex.nome),
                  h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, ex.musculo)
                ),
                videoId ? h("div", { style: { background: COLORS.greenLight, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 } },
                  h("span", { style: { fontSize: 12 } }, "✅"),
                  h("span", { style: { fontSize: 11, color: COLORS.green, fontWeight: 600, fontFamily: FONT_TEXT } }, "OK")
                ) : null
              ),
              h("div", { style: { display: "flex", gap: 8 } },
                h("input", {
                  value: draft[key] || "",
                  onChange: (e) => setDraft(d => Object.assign({}, d, { [key]: e.target.value })),
                  placeholder: "https://youtu.be/...",
                  style: {
                    flex: 1, padding: "10px 12px", borderRadius: 10, boxSizing: "border-box",
                    border: `1.5px solid ${videoId ? COLORS.green + "60" : COLORS.grayMid}`,
                    fontSize: 12, fontFamily: FONT_TEXT, color: COLORS.dark,
                    background: videoId ? COLORS.greenLight : COLORS.gray, outline: "none",
                  }
                }),
                draft[key] ? h("button", {
                  onClick: () => setDraft(d => Object.assign({}, d, { [key]: "" })),
                  style: { background: COLORS.gray, border: `1px solid ${COLORS.grayMid}`, borderRadius: 10, padding: "0 12px", color: COLORS.grayText, fontSize: 16, cursor: "pointer" }
                }, "✕") : null
              ),
              videoId ? h("div", { style: { marginTop: 10, borderRadius: 10, overflow: "hidden", position: "relative" } },
                h("img", { src: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, alt: "thumb", style: { width: "100%", height: 90, objectFit: "cover", display: "block" } }),
                h("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" } },
                  h("div", { style: { width: 36, height: 36, background: "rgba(255,255,255,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 } }, "▶")
                )
              ) : null
            );
          })
        ),

        h("button", {
          onClick: save,
          style: {
            width: "100%",
            background: saved ? `linear-gradient(135deg, ${COLORS.green}, #6DD65A)` : `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
            border: "none", borderRadius: 18, padding: "18px",
            fontSize: 16, fontWeight: 700, color: COLORS.white, cursor: "pointer",
            fontFamily: FONT_TITLE, transition: "background 0.3s",
            boxShadow: `0 8px 24px ${COLORS.blue}40`,
          }
        }, saved ? "✅ Vídeos salvos!" : "💾 Salvar vídeos")
      )
    );
  }

  // ── APP PRINCIPAL ─────────────────────────────────────────────────────

  function SerAtivoApp() {
    const useState = S.useState;
    const [screen, setScreen] = useState("splash");
    const [selectedSession, setSelectedSession] = useState(null);
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [completedSessions, setCompletedSessions] = useState([]);
    const [borgSession, setBorgSession] = useState(null);
    const [borgRatings, setBorgRatings] = useState([]);
    const [profileData, setProfileData] = useState({ nome: "Maria Santos", id: "HC-2024-0042" });
    const [videos, setVideos] = useState(Object.assign({}, S.DEFAULT_VIDEOS));

    const showNav = ["home", "sessions", "progress", "profile"].includes(screen);

    let screenEl = null;
    if (screen === "splash") screenEl = h(S.SplashScreen, { onDone: () => setScreen("home") });
    else if (screen === "home") screenEl = h(S.HomeScreen, { setScreen, setSelectedSession, completedSessions });
    else if (screen === "sessions") screenEl = h(S.SessionsScreen, { setScreen, setSelectedSession, completedSessions });
    else if (screen === "session-detail") screenEl = h(S.SessionDetailScreen, { session: selectedSession, setScreen, setActiveWorkout, videos });
    else if (screen === "workout" && activeWorkout) screenEl = h(S.WorkoutScreen, { activeWorkout, setScreen, setCompletedSessions, completedSessions, setBorgSession });
    else if (screen === "borg") screenEl = h(S.BorgScreen, { borgSession, setScreen, setBorgRatings });
    else if (screen === "session-complete") screenEl = h(S.SessionCompleteScreen, { setScreen, borgSession, borgRatings });
    else if (screen === "progress") screenEl = h(S.ProgressScreen, { completedSessions, borgRatings });
    else if (screen === "profile") screenEl = h(S.ProfileScreen, { setScreen, onProfileChange: setProfileData });
    else if (screen === "report") screenEl = h(S.ReportScreen, { setScreen, completedSessions, borgRatings, profile: profileData });
    else if (screen === "video-manager") screenEl = h(VideoManagerScreen, { setScreen, videos, setVideos });
    else screenEl = h(S.HomeScreen, { setScreen, setSelectedSession, completedSessions });

    return h("div", { style: { minHeight: "100vh", background: COLORS.gray, fontFamily: FONT_TEXT } },
      h("div", { style: { maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: COLORS.white, position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.06)" } },
        screenEl,
        showNav ? h(S.BottomNav, { active: screen, setScreen }) : null
      )
    );
  }

  Object.assign(window.SerAtivo, { VideoManagerScreen, SerAtivoApp });
})();
