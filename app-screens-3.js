// Ser Ativo Home Basic — Telas Parte 3: Conclusão da Sessão, Progresso
"use strict";

(function () {
  const S = window.SerAtivo;
  const h = S.h;
  const COLORS = S.COLORS, FONT_TITLE = S.FONT_TITLE, FONT_TEXT = S.FONT_TEXT;
  const BORG_SCALE = S.BORG_SCALE;

  function SessionCompleteScreen({ setScreen, borgSession, borgRatings }) {
    const lastBorg = borgRatings[borgRatings.length - 1];
    const mins = borgSession ? Math.floor(borgSession.elapsed / 60) : 0;
    const secs = borgSession ? borgSession.elapsed % 60 : 0;

    const items = [
      { label: "Sessão concluída", value: `#${borgSession && borgSession.session ? borgSession.session.id : "—"}`, icon: "🎯" },
      { label: "Tempo total", value: `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`, icon: "⏱️" },
      { label: "Borg relatado", value: lastBorg ? `${lastBorg.borg} – ${BORG_SCALE[lastBorg.borg] ? BORG_SCALE[lastBorg.borg].label : ""}` : "—", icon: "📊" },
    ];

    return h("div", { style: { background: COLORS.white, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" } },
      h("div", { style: { fontSize: 72, marginBottom: 16 } }, "🏆"),
      h("div", { style: { fontSize: 28, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, textAlign: "center", marginBottom: 8 } }, "Parabéns!"),
      h("div", { style: { fontSize: 16, color: COLORS.grayText, fontFamily: FONT_TEXT, textAlign: "center", marginBottom: 32 } }, "Você concluiu a sessão com sucesso!"),

      h("div", { style: { background: COLORS.gray, borderRadius: 24, padding: 24, width: "100%", marginBottom: 32 } },
        items.map((item, i) => h("div", {
          key: i,
          style: {
            display: "flex", alignItems: "center", gap: 14,
            paddingBottom: i < items.length - 1 ? 16 : 0, marginBottom: i < items.length - 1 ? 16 : 0,
            borderBottom: i < items.length - 1 ? `1px solid ${COLORS.grayMid}` : "none",
          }
        },
          h("span", { style: { fontSize: 22 } }, item.icon),
          h("div", { style: { flex: 1 } },
            h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } }, item.label),
            h("div", { style: { fontSize: 16, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE } }, item.value)
          )
        ))
      ),

      h("button", {
        onClick: () => setScreen("home"),
        style: {
          width: "100%", background: `linear-gradient(135deg, ${COLORS.green}, #6DD65A)`,
          border: "none", borderRadius: 18, padding: "20px",
          fontSize: 17, fontWeight: 700, color: COLORS.white, cursor: "pointer",
          fontFamily: FONT_TITLE, boxShadow: `0 8px 24px ${COLORS.green}40`, marginBottom: 12,
        }
      }, "Concluir ✓"),
      h("button", {
        onClick: () => setScreen("sessions"),
        style: {
          width: "100%", background: "transparent", border: `1.5px solid ${COLORS.grayMid}`,
          borderRadius: 18, padding: "16px", fontSize: 15, fontWeight: 600,
          color: COLORS.darkMid, cursor: "pointer", fontFamily: FONT_TEXT,
        }
      }, "Ver próxima sessão")
    );
  }

  function ProgressScreen({ completedSessions, borgRatings }) {
    const pct = Math.round((completedSessions.length / 32) * 100);
    const totalMins = completedSessions.length * 37;
    const avgBorg = borgRatings.length > 0
      ? (borgRatings.reduce((a, b) => a + b.borg, 0) / borgRatings.length).toFixed(1)
      : "—";

    const weeklyData = [0, 0, 0, 0, 0, 0, 0, 0];
    completedSessions.forEach(id => {
      const idx = Math.min(Math.floor((id - 1) / 4), 7);
      weeklyData[idx]++;
    });

    const borgEvolution = borgRatings.slice(-8);
    const maxBorg = 10;

    const summaryStats = [
      { icon: "✅", label: "Realizadas", value: completedSessions.length, suffix: "" },
      { icon: "📊", label: "Conclusão", value: pct, suffix: "%" },
      { icon: "⏱️", label: "Tempo total", value: totalMins, suffix: " min" },
      { icon: "💓", label: "Borg médio", value: avgBorg, suffix: "" },
    ];

    return h("div", { style: { paddingBottom: 90 } },
      h("div", { style: { background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" } },
        h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE, marginBottom: 4 } }, "Progresso"),
        h("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: FONT_TEXT } }, "Acompanhe sua evolução no programa")
      ),

      h("div", { style: { padding: "24px 20px" } },
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 } },
          summaryStats.map((s, i) => h("div", {
            key: i,
            style: { background: COLORS.white, borderRadius: 20, padding: "18px 16px", boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` }
          },
            h("div", { style: { fontSize: 20, marginBottom: 6 } }, s.icon),
            h("div", { style: { fontSize: 24, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE } }, s.value, h("span", { style: { fontSize: 13 } }, s.suffix)),
            h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } }, s.label)
          ))
        ),

        // Progress ring
        h("div", { style: { background: COLORS.white, borderRadius: 24, padding: 24, marginBottom: 20, boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` } },
          h("div", { style: { fontSize: 15, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 20 } }, "Adesão ao tratamento"),
          h("div", { style: { display: "flex", alignItems: "center", gap: 24 } },
            h("div", { style: { position: "relative", width: 100, height: 100, flexShrink: 0 } },
              h("svg", { width: "100", height: "100" },
                h("circle", { cx: "50", cy: "50", r: "42", fill: "none", stroke: COLORS.grayMid, strokeWidth: "8" }),
                h("circle", {
                  cx: "50", cy: "50", r: "42", fill: "none", stroke: COLORS.green, strokeWidth: "8",
                  strokeDasharray: 2 * Math.PI * 42,
                  strokeDashoffset: 2 * Math.PI * 42 * (1 - pct / 100),
                  strokeLinecap: "round", transform: "rotate(-90 50 50)",
                })
              ),
              h("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" } },
                h("div", { style: { fontSize: 18, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE } }, `${pct}%`)
              )
            ),
            h("div", { style: { flex: 1 } },
              h("div", { style: { fontSize: 13, color: COLORS.grayText, fontFamily: FONT_TEXT, marginBottom: 4 } }, `${completedSessions.length} de 32 sessões concluídas`),
              h("div", { style: { height: 6, background: COLORS.gray, borderRadius: 3, marginBottom: 8 } },
                h("div", { style: { height: "100%", width: `${pct}%`, background: COLORS.green, borderRadius: 3 } })
              ),
              h("div", { style: { fontSize: 12, color: COLORS.green, fontWeight: 600, fontFamily: FONT_TEXT } },
                completedSessions.length >= 32 ? "Programa completo! 🎉" : `Faltam ${32 - completedSessions.length} sessões`)
            )
          )
        ),

        // Weekly chart
        h("div", { style: { background: COLORS.white, borderRadius: 24, padding: 24, marginBottom: 20, boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` } },
          h("div", { style: { fontSize: 15, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 4 } }, "Sessões por semana"),
          h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT, marginBottom: 20 } }, "Histórico das 8 semanas do programa"),
          h("div", { style: { display: "flex", alignItems: "flex-end", gap: 8, height: 100 } },
            weeklyData.map((v, i) => h("div", {
              key: i,
              style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }
            },
              h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, v),
              h("div", {
                style: {
                  width: "100%", height: v === 0 ? 4 : `${(v / 4) * 80}px`,
                  background: i < 2 ? COLORS.blue : i < 4 ? COLORS.green : COLORS.grayMid,
                  borderRadius: 6, transition: "height 0.5s",
                }
              }),
              h("div", { style: { fontSize: 10, color: COLORS.grayText, fontFamily: FONT_TEXT } }, `S${i + 1}`)
            ))
          )
        ),

        // Borg evolution
        borgRatings.length > 0 ? h("div", { style: { background: COLORS.white, borderRadius: 24, padding: 24, boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` } },
          h("div", { style: { fontSize: 15, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 4 } }, "Evolução da percepção de esforço (Borg)"),
          h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT, marginBottom: 20 } }, `Últimas ${borgEvolution.length} sessões avaliadas`),
          h("div", { style: { display: "flex", alignItems: "flex-end", gap: 8, height: 80 } },
            borgEvolution.map((b, i) => h("div", {
              key: i,
              style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }
            },
              h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, b.borg),
              h("div", {
                style: {
                  width: "100%", height: `${(b.borg / maxBorg) * 64}px`,
                  background: (BORG_SCALE[b.borg] && BORG_SCALE[b.borg].color) || COLORS.blue,
                  borderRadius: 6,
                }
              }),
              h("div", { style: { fontSize: 10, color: COLORS.grayText, fontFamily: FONT_TEXT } }, `S${b.session}`)
            ))
          )
        ) : null
      )
    );
  }

  Object.assign(window.SerAtivo, { SessionCompleteScreen, ProgressScreen });
})();
