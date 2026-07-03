// Ser Ativo Home Basic — Telas Parte 1: Splash, Home, Sessões
"use strict";

(function () {
  const S = window.SerAtivo;
  const h = S.h, useState = S.useState, useEffect = S.useEffect;
  const COLORS = S.COLORS, FONT_TITLE = S.FONT_TITLE, FONT_TEXT = S.FONT_TEXT;
  const SESSIONS = S.SESSIONS, Logo = S.Logo;

  function SplashScreen({ onDone }) {
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(0.7);

    useEffect(() => {
      const t1 = setTimeout(() => { setOpacity(1); setScale(1); }, 100);
      const t2 = setTimeout(onDone, 2200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return h("div", {
      style: {
        width: "100%", minHeight: "100vh", background: COLORS.white,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 20, transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(.34,1.56,.64,1)",
        opacity: opacity, transform: `scale(${scale})`,
      }
    },
      h(Logo, { size: 80 }),
      h("div", { style: { textAlign: "center" } },
        h("div", { style: { fontSize: 24, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, letterSpacing: -0.5 } }, "Ser Ativo"),
        h("div", { style: { fontSize: 14, color: COLORS.blue, fontFamily: FONT_TITLE, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" } }, "Home Basic")
      ),
      h("div", { style: { marginTop: 8, fontSize: 13, color: COLORS.grayText, fontFamily: FONT_TEXT, textAlign: "center" } }, "Hospital das Clínicas · UFPE"),
      h("div", { style: { marginTop: 40, display: "flex", gap: 6 } },
        [0, 1, 2].map(i => h("div", {
          key: i,
          style: {
            width: i === 1 ? 20 : 8, height: 8, borderRadius: 4,
            background: i === 1 ? COLORS.blue : COLORS.grayMid,
            transition: "width 0.3s",
          }
        }))
      )
    );
  }

  function HomeScreen({ setScreen, setSelectedSession, completedSessions }) {
    const totalTime = completedSessions.length * 37;
    const streak = completedSessions.length >= 3 ? 3 : completedSessions.length;

    const statCards = [
      { label: "Sessão atual", value: completedSessions.length + 1, suffix: "", icon: "🎯" },
      { label: "Concluídas", value: completedSessions.length, suffix: "", icon: "✅" },
      { label: "Tempo total", value: `${totalTime}`, suffix: "min", icon: "⏱️" },
      { label: "Sequência", value: streak, suffix: " dias", icon: "🔥" },
    ];

    return h("div", { style: { paddingBottom: 90 } },
      // Header
      h("div", { style: { background: `linear-gradient(160deg, ${COLORS.blue} 0%, #3A7FFF 100%)`, padding: "52px 24px 32px", borderRadius: "0 0 32px 32px" } },
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
          h("div", null,
            h("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: FONT_TEXT, marginBottom: 4 } }, "Bem-vinda de volta 👋"),
            h("div", { style: { fontSize: 26, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE } }, "Olá, Maria!")
          ),
          h(Logo, { size: 44 })
        ),
        h("div", { style: { marginTop: 24, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 16px" } },
          h("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 } },
            h("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: FONT_TEXT } }, "Progresso do programa"),
            h("span", { style: { fontSize: 12, color: COLORS.white, fontFamily: FONT_TEXT, fontWeight: 600 } }, `${completedSessions.length}/32 sessões`)
          ),
          h("div", { style: { height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 3 } },
            h("div", { style: { height: "100%", width: `${(completedSessions.length / 32) * 100}%`, background: COLORS.green, borderRadius: 3, transition: "width 0.5s" } })
          )
        )
      ),

      h("div", { style: { padding: "24px 20px 0" } },
        // Stats grid
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 } },
          statCards.map((s, i) => h("div", {
            key: i,
            style: { background: COLORS.white, borderRadius: 20, padding: "16px", boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` }
          },
            h("div", { style: { fontSize: 20, marginBottom: 6 } }, s.icon),
            h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE } }, s.value, h("span", { style: { fontSize: 12 } }, s.suffix)),
            h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } }, s.label)
          ))
        ),

        // Action buttons
        h("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 } },
          h("button", {
            onClick: () => {
              const nextSession = SESSIONS.find(s => !completedSessions.includes(s.id)) || SESSIONS[0];
              setSelectedSession(nextSession);
              setScreen("session-detail");
            },
            style: {
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
              border: "none", borderRadius: 18, padding: "18px 24px",
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
              boxShadow: `0 8px 24px ${COLORS.blue}40`,
            }
          },
            h("div", { style: { width: 44, height: 44, background: "rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 } }, "▶️"),
            h("div", { style: { textAlign: "left" } },
              h("div", { style: { fontSize: 16, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE } }, "Iniciar Sessão"),
              h("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: FONT_TEXT } },
                `Sessão ${completedSessions.length + 1 > 32 ? 32 : completedSessions.length + 1} · Treino ${completedSessions.length % 2 === 0 ? "A" : "B"}`)
            ),
            h("div", { style: { marginLeft: "auto", color: "rgba(255,255,255,0.7)", fontSize: 20 } }, "›")
          ),

          h("button", {
            onClick: () => setScreen("sessions"),
            style: {
              background: COLORS.white, border: `1.5px solid ${COLORS.grayMid}`,
              borderRadius: 18, padding: "18px 24px",
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
            }
          },
            h("div", { style: { width: 44, height: 44, background: COLORS.blueLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 } }, "📋"),
            h("div", { style: { textAlign: "left" } },
              h("div", { style: { fontSize: 16, fontWeight: 600, color: COLORS.dark, fontFamily: FONT_TITLE } }, "Ver Plano de Treino"),
              h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "32 sessões programadas")
            ),
            h("div", { style: { marginLeft: "auto", color: COLORS.grayText, fontSize: 20 } }, "›")
          )
        ),

        // Weekly overview
        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` } },
          h("div", { style: { fontSize: 15, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 16 } }, "Esta semana"),
          h("div", { style: { display: "flex", gap: 8 } },
            ["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => h("div", {
              key: i,
              style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }
            },
              h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, d),
              h("div", {
                style: {
                  width: 32, height: 32, borderRadius: "50%",
                  background: i < 3 ? COLORS.green : i === 3 ? COLORS.blueLight : COLORS.gray,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }
              }, i < 3 ? "✓" : i === 3 ? "•" : "")
            ))
          )
        )
      )
    );
  }

  function SessionsScreen({ setScreen, setSelectedSession, completedSessions }) {
    const completed = completedSessions.length;

    return h("div", { style: { paddingBottom: 90 } },
      h("div", { style: { background: COLORS.white, padding: "52px 24px 20px", borderBottom: `1px solid ${COLORS.grayMid}` } },
        h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 4 } }, "Sessões"),
        h("div", { style: { fontSize: 13, color: COLORS.grayText, fontFamily: FONT_TEXT } }, `${completed} de 32 concluídas · ${Math.round((completed / 32) * 100)}%`),
        h("div", { style: { marginTop: 12, height: 6, background: COLORS.grayMid, borderRadius: 3 } },
          h("div", { style: { height: "100%", width: `${(completed / 32) * 100}%`, background: COLORS.green, borderRadius: 3 } })
        )
      ),

      h("div", { style: { padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 } },
        SESSIONS.map(s => {
          const done = completedSessions.includes(s.id);
          const isCurrent = s.id === completed + 1;
          return h("button", {
            key: s.id,
            onClick: () => { setSelectedSession(s); setScreen("session-detail"); },
            style: {
              background: done ? COLORS.greenLight : isCurrent ? COLORS.blueLight : COLORS.white,
              border: `1.5px solid ${done ? COLORS.green + "60" : isCurrent ? COLORS.blue + "40" : COLORS.grayMid}`,
              borderRadius: 16, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
              textAlign: "left", width: "100%",
            }
          },
            h("div", {
              style: {
                width: 42, height: 42, borderRadius: 12,
                background: done ? COLORS.green : isCurrent ? COLORS.blue : COLORS.gray,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: done || isCurrent ? COLORS.white : COLORS.grayText,
                fontSize: done ? 20 : 15, fontWeight: 700, fontFamily: FONT_TITLE,
                flexShrink: 0,
              }
            }, done ? "✓" : s.id),
            h("div", { style: { flex: 1 } },
              h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" } },
                h("span", { style: { fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: FONT_TITLE } }, `Sessão ${s.id}`),
                h("span", {
                  style: {
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                    background: s.tipo === "A" ? COLORS.blueLight : COLORS.greenLight,
                    color: s.tipo === "A" ? COLORS.blue : COLORS.green,
                    fontFamily: FONT_TEXT,
                  }
                }, `Treino ${s.tipo}`),
                isCurrent ? h("span", {
                  style: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: `${COLORS.blue}20`, color: COLORS.blue, fontFamily: FONT_TEXT }
                }, "Atual") : null
              ),
              h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } },
                `${s.duracao} · Borg alvo ${s.borgAlvo} · Sem. ${s.semana}`)
            ),
            h("div", { style: { color: COLORS.grayText, fontSize: 18 } }, "›")
          );
        })
      )
    );
  }

  Object.assign(window.SerAtivo, { SplashScreen, HomeScreen, SessionsScreen });
})();
