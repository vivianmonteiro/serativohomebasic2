// Ser Ativo Home Basic — Telas Parte 2: Detalhe da Sessão, Treino, Borg
"use strict";

(function () {
  const S = window.SerAtivo;
  const h = S.h, useState = S.useState, useEffect = S.useEffect, useRef = S.useRef;
  const COLORS = S.COLORS, FONT_TITLE = S.FONT_TITLE, FONT_TEXT = S.FONT_TEXT;
  const TREINO_A = S.TREINO_A, TREINO_B = S.TREINO_B, BORG_SCALE = S.BORG_SCALE;
  const getYoutubeId = S.getYoutubeId, VideoModal = S.VideoModal;

  function SessionDetailScreen({ session, setScreen, setActiveWorkout, videos }) {
    const [activeVideo, setActiveVideo] = useState(null);
    if (!session) return null;

    const exercises = session.tipo === "A" ? TREINO_A : TREINO_B;
    const equipamentos = session.tipo === "A" ? ["Cadeira", "Tapete"] : ["Elástico", "Cadeira", "Tapete"];
    const safeVideos = videos || {};
    const totalVideos = exercises.filter(ex => getYoutubeId(safeVideos[`${session.tipo}-${ex.id}`])).length;

    const infoCards = [
      { icon: "⏱️", label: "Duração", value: session.duracao },
      { icon: "🎯", label: "Borg alvo", value: session.borgAlvo },
      { icon: "💪", label: "Exercícios", value: `${exercises.length}` },
      { icon: "🗓️", label: "Semana", value: session.semana },
    ];

    return h("div", { style: { paddingBottom: 30 } },
      activeVideo ? h(VideoModal, { videoUrl: activeVideo.url, exerciseName: activeVideo.nome, onClose: () => setActiveVideo(null) }) : null,

      h("div", { style: { background: `linear-gradient(160deg, ${COLORS.blue} 0%, ${COLORS.blueMid} 100%)`, padding: "52px 24px 28px" } },
        h("button", {
          onClick: () => setScreen("sessions"),
          style: { background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 14px", color: COLORS.white, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: FONT_TEXT }
        }, "← Voltar"),
        h("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: FONT_TEXT, marginBottom: 4 } }, `Sessão ${session.id}`),
        h("div", { style: { fontSize: 24, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE } },
          `Treino ${session.tipo} — ${session.tipo === "A" ? "Membros Inferiores + Core" : "Membros Superiores + Total"}`),
        totalVideos > 0 ? h("div", {
          style: { marginTop: 10, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px", display: "inline-flex", alignItems: "center", gap: 6 }
        },
          h("span", { style: { fontSize: 14 } }, "🎬"),
          h("span", { style: { fontSize: 12, color: COLORS.white, fontFamily: FONT_TEXT } }, `${totalVideos} vídeo${totalVideos > 1 ? "s" : ""} disponível${totalVideos > 1 ? "is" : ""}`)
        ) : null
      ),

      h("div", { style: { padding: "24px 20px" } },
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 } },
          infoCards.map((info, i) => h("div", {
            key: i,
            style: { background: COLORS.gray, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }
          },
            h("span", { style: { fontSize: 22 } }, info.icon),
            h("div", null,
              h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, info.label),
              h("div", { style: { fontSize: 16, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE } }, info.value)
            )
          ))
        ),

        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" } },
          h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 12 } }, "Equipamentos"),
          h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
            equipamentos.map(e => h("span", {
              key: e,
              style: { background: COLORS.blueLight, color: COLORS.blue, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, fontFamily: FONT_TEXT }
            }, e))
          )
        ),

        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 24, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" } },
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
            h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE } }, "Exercícios"),
            h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "Toque 🎬 para ver o vídeo")
          ),
          h("div", { style: { display: "flex", flexDirection: "column" } },
            exercises.map((ex, i) => {
              const key = `${session.tipo}-${ex.id}`;
              const videoUrl = safeVideos[key];
              const videoId = getYoutubeId(videoUrl);
              const hasVideo = !!videoId;

              return h("div", { key: i },
                h("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0" } },
                  hasVideo
                    ? h("div", {
                        style: { width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, position: "relative", cursor: "pointer" },
                        onClick: () => setActiveVideo({ url: videoUrl, nome: ex.nome }),
                      },
                        h("img", { src: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }),
                        h("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" } },
                          h("span", { style: { fontSize: 16, color: "white" } }, "▶")
                        )
                      )
                    : h("div", {
                        style: { width: 44, height: 44, background: COLORS.gray, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }
                      }, ex.emoji),

                  h("div", { style: { flex: 1, minWidth: 0 } },
                    h("div", { style: { fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: FONT_TITLE } }, ex.nome),
                    h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, `${ex.series}x ${ex.reps} · descanso ${ex.descanso}`)
                  ),

                  hasVideo
                    ? h("button", {
                        onClick: () => setActiveVideo({ url: videoUrl, nome: ex.nome }),
                        style: { background: COLORS.blue, border: "none", borderRadius: 10, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }
                      },
                        h("span", { style: { fontSize: 13 } }, "🎬"),
                        h("span", { style: { fontSize: 11, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TEXT } }, "Ver")
                      )
                    : h("div", {
                        style: { fontSize: 11, background: COLORS.gray, padding: "5px 9px", borderRadius: 6, color: COLORS.grayText, fontFamily: FONT_TEXT, flexShrink: 0 }
                      }, ex.musculo)
                ),
                i < exercises.length - 1 ? h("div", { style: { height: 1, background: COLORS.grayMid } }) : null
              );
            })
          )
        ),

        h("button", {
          onClick: () => {
            setActiveWorkout({ session, exercises, currentExercise: 0, startTime: Date.now() });
            setScreen("workout");
          },
          style: {
            width: "100%", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
            border: "none", borderRadius: 18, padding: "20px",
            fontSize: 17, fontWeight: 700, color: COLORS.white,
            cursor: "pointer", fontFamily: FONT_TITLE,
            boxShadow: `0 8px 24px ${COLORS.blue}40`,
            letterSpacing: 0.5,
          }
        }, "▶ INICIAR TREINO")
      )
    );
  }

  function WorkoutScreen({ activeWorkout, setScreen, setCompletedSessions, completedSessions, setBorgSession }) {
    const [elapsed, setElapsed] = useState(0);
    const [paused, setPaused] = useState(false);
    const [currentEx, setCurrentEx] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
      if (!paused) {
        intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      }
      return () => clearInterval(intervalRef.current);
    }, [paused]);

    const exercise = activeWorkout.exercises[currentEx];
    const total = activeWorkout.exercises.length;
    const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const secs = (elapsed % 60).toString().padStart(2, "0");
    const progress = (currentEx / total) * 100;
    const circumference = 2 * Math.PI * 80;
    const dashOffset = circumference - ((elapsed % 60) / 60) * circumference;

    function finishWorkout() {
      clearInterval(intervalRef.current);
      if (!completedSessions.includes(activeWorkout.session.id)) {
        setCompletedSessions(prev => [...prev, activeWorkout.session.id]);
      }
      setBorgSession({ session: activeWorkout.session, elapsed });
      setScreen("borg");
    }

    return h("div", { style: { background: COLORS.dark, minHeight: "100vh", paddingBottom: 40 } },
      h("div", { style: { padding: "52px 24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" } },
        h("div", null,
          h("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: FONT_TEXT } }, "Em andamento"),
          h("div", { style: { fontSize: 16, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE } },
            `Sessão ${activeWorkout.session.id} · Treino ${activeWorkout.session.tipo}`)
        ),
        h("div", { style: { fontSize: 13, color: COLORS.grayText, fontFamily: FONT_TEXT } }, `${currentEx + 1}/${total}`)
      ),

      h("div", { style: { marginBottom: 30, padding: "0 24px" } },
        h("div", { style: { height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2 } },
          h("div", { style: { height: "100%", width: `${progress}%`, background: COLORS.green, borderRadius: 2, transition: "width 0.3s" } })
        )
      ),

      h("div", { style: { display: "flex", justifyContent: "center", marginBottom: 32 } },
        h("div", { style: { position: "relative", width: 200, height: 200 } },
          h("svg", { width: "200", height: "200", style: { position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" } },
            h("circle", { cx: "100", cy: "100", r: "80", fill: "none", stroke: "rgba(255,255,255,0.1)", strokeWidth: "8" }),
            h("circle", {
              cx: "100", cy: "100", r: "80", fill: "none", stroke: COLORS.blue, strokeWidth: "8",
              strokeDasharray: circumference, strokeDashoffset: dashOffset,
              strokeLinecap: "round", style: { transition: "stroke-dashoffset 0.9s linear" }
            })
          ),
          h("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } },
            h("div", { style: { fontSize: 42, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE, letterSpacing: -1 } }, `${mins}:${secs}`),
            h("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: FONT_TEXT } }, "tempo decorrido")
          )
        )
      ),

      h("div", { style: { margin: "0 20px 24px", background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: "24px 20px", border: "1px solid rgba(255,255,255,0.1)" } },
        h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 } }, "Exercício atual"),
        h("div", { style: { fontSize: 28, textAlign: "center", marginBottom: 10 } }, exercise.emoji),
        h("div", { style: { fontSize: 20, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE, textAlign: "center", marginBottom: 6 } }, exercise.nome),
        h("div", { style: { fontSize: 14, color: "rgba(255,255,255,0.65)", fontFamily: FONT_TEXT, textAlign: "center", marginBottom: 14 } }, exercise.musculo),
        h("div", { style: { display: "flex", justifyContent: "center", gap: 20 } },
          h("div", { style: { textAlign: "center" } },
            h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.blue, fontFamily: FONT_TITLE } }, exercise.series),
            h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "séries")
          ),
          h("div", { style: { width: 1, background: "rgba(255,255,255,0.1)" } }),
          h("div", { style: { textAlign: "center" } },
            h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.green, fontFamily: FONT_TITLE } }, exercise.reps),
            h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "repetições")
          ),
          h("div", { style: { width: 1, background: "rgba(255,255,255,0.1)" } }),
          h("div", { style: { textAlign: "center" } },
            h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.yellow, fontFamily: FONT_TITLE } }, exercise.descanso),
            h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "descanso")
          )
        )
      ),

      h("div", { style: { padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 } },
        h("div", { style: { display: "flex", gap: 12 } },
          h("button", {
            onClick: () => setPaused(p => !p),
            style: { flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "16px", color: COLORS.white, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FONT_TEXT }
          }, paused ? "▶ Retomar" : "⏸ Pausar"),
          h("button", {
            onClick: () => {
              if (currentEx < total - 1) setCurrentEx(c => c + 1);
              else finishWorkout();
            },
            style: { flex: 1, background: COLORS.blue, border: "none", borderRadius: 14, padding: "16px", color: COLORS.white, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FONT_TEXT }
          }, currentEx < total - 1 ? "Próximo ›" : "Finalizar ✓")
        ),
        h("button", {
          onClick: finishWorkout,
          style: { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "14px", color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer", fontFamily: FONT_TEXT }
        }, "Encerrar treino")
      )
    );
  }

  function BorgScreen({ borgSession, setScreen, setBorgRatings }) {
    const [selected, setSelected] = useState(null);
    const [obs, setObs] = useState("");
    const [saved, setSaved] = useState(false);
    const mins = borgSession ? Math.floor(borgSession.elapsed / 60) : 0;
    const secs = borgSession ? borgSession.elapsed % 60 : 0;

    function save() {
      if (selected === null) return;
      setBorgRatings(prev => [...prev, { session: borgSession && borgSession.session ? borgSession.session.id : null, borg: selected, obs, date: new Date().toISOString() }]);
      setSaved(true);
      setTimeout(() => setScreen("session-complete"), 600);
    }

    return h("div", { style: { background: COLORS.white, minHeight: "100vh", paddingBottom: 40 } },
      h("div", { style: { background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" } },
        h("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: FONT_TEXT, marginBottom: 6 } }, "Pós-treino"),
        h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE } }, "Escala de Borg"),
        h("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: FONT_TEXT, marginTop: 6 } }, "Como você percebeu o esforço durante o treino?")
      ),

      h("div", { style: { padding: "24px 20px" } },
        borgSession ? h("div", {
          style: { background: COLORS.greenLight, borderRadius: 16, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }
        },
          h("div", { style: { fontSize: 24 } }, "🎉"),
          h("div", null,
            h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE } },
              `Sessão ${borgSession.session ? borgSession.session.id : ""} concluída!`),
            h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } },
              `Tempo: ${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`)
          )
        ) : null,

        h("div", { style: { marginBottom: 20 } },
          BORG_SCALE.map(b => h("button", {
            key: b.val,
            onClick: () => setSelected(b.val),
            style: {
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              background: selected === b.val ? `${b.color}20` : COLORS.white,
              border: selected === b.val ? `2px solid ${b.color}` : `1.5px solid ${COLORS.grayMid}`,
              borderRadius: 14, padding: "12px 16px", marginBottom: 8, cursor: "pointer",
              transition: "all 0.15s",
            }
          },
            h("div", {
              style: {
                width: 36, height: 36, borderRadius: "50%", background: b.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE, flexShrink: 0,
              }
            }, b.val),
            h("div", { style: { flex: 1, textAlign: "left" } },
              h("div", { style: { fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: FONT_TITLE } }, b.label)
            ),
            h("span", { style: { fontSize: 18 } }, b.emoji),
            selected === b.val ? h("span", { style: { fontSize: 16, color: b.color } }, "✓") : null
          ))
        ),

        h("div", { style: { marginBottom: 20 } },
          h("div", { style: { fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 8 } }, "Observações (opcional)"),
          h("textarea", {
            value: obs,
            onChange: (e) => setObs(e.target.value),
            placeholder: "Como você se sentiu? Algum desconforto?",
            style: {
              width: "100%", padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${COLORS.grayMid}`,
              fontSize: 13, fontFamily: FONT_TEXT, resize: "none", height: 80, boxSizing: "border-box",
              color: COLORS.dark, background: COLORS.gray, outline: "none",
            }
          })
        ),

        h("button", {
          onClick: save,
          style: {
            width: "100%",
            background: selected !== null ? `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})` : COLORS.grayMid,
            border: "none", borderRadius: 16, padding: "18px",
            fontSize: 16, fontWeight: 700, color: COLORS.white,
            cursor: selected !== null ? "pointer" : "default", fontFamily: FONT_TITLE,
          }
        }, saved ? "✓ Salvo!" : "Salvar")
      )
    );
  }

  Object.assign(window.SerAtivo, { SessionDetailScreen, WorkoutScreen, BorgScreen });
})();
