// Ser Ativo Home Basic — Tela Gerenciador de Treinos (editável)
"use strict";

(function () {
  const S = window.SerAtivo;
  const h = S.h, useState = S.useState;
  const COLORS = S.COLORS, FONT_TITLE = S.FONT_TITLE, FONT_TEXT = S.FONT_TEXT;

  const EMOJIS = ["🦵","💪","🏋️","🧘","🚶","👣","🦿","🤸","🦾","🙆","🌿","🏃","🤾","⚽","🧗","🤼","🏊","🚴"];

  function WorkoutManagerScreen({ setScreen, treinoA, setTreinoA, treinoB, setTreinoB }) {
    const [activeTab, setActiveTab] = useState("A");
    const [saved, setSaved] = useState(false);
    const [editingIdx, setEditingIdx] = useState(null); // índice do exercício sendo editado
    const [showAddForm, setShowAddForm] = useState(false);

    const exercises = activeTab === "A" ? treinoA : treinoB;
    const setExercises = activeTab === "A" ? setTreinoA : setTreinoB;

    const emptyExercise = { nome: "", series: 3, reps: "12", descanso: "60s", musculo: "", emoji: "💪" };
    const [newEx, setNewEx] = useState(Object.assign({}, emptyExercise));
    const [editDraft, setEditDraft] = useState(null);

    function startEdit(idx) {
      setEditingIdx(idx);
      setEditDraft(Object.assign({}, exercises[idx]));
      setShowAddForm(false);
    }

    function saveEdit() {
      const updated = exercises.map((ex, i) => i === editingIdx ? Object.assign({}, editDraft) : ex);
      setExercises(updated);
      setEditingIdx(null);
      setEditDraft(null);
      flashSaved();
    }

    function cancelEdit() {
      setEditingIdx(null);
      setEditDraft(null);
    }

    function deleteExercise(idx) {
      if (exercises.length <= 1) return;
      const updated = exercises.filter((_, i) => i !== idx).map((ex, i) => Object.assign({}, ex, { id: i + 1 }));
      setExercises(updated);
      flashSaved();
    }

    function addExercise() {
      if (!newEx.nome.trim()) return;
      const newId = exercises.length + 1;
      const updated = exercises.concat([Object.assign({}, newEx, { id: newId })]);
      setExercises(updated);
      setNewEx(Object.assign({}, emptyExercise));
      setShowAddForm(false);
      flashSaved();
    }

    function moveUp(idx) {
      if (idx === 0) return;
      const updated = exercises.slice();
      const temp = updated[idx - 1];
      updated[idx - 1] = updated[idx];
      updated[idx] = temp;
      setExercises(updated.map((ex, i) => Object.assign({}, ex, { id: i + 1 })));
      flashSaved();
    }

    function moveDown(idx) {
      if (idx === exercises.length - 1) return;
      const updated = exercises.slice();
      const temp = updated[idx + 1];
      updated[idx + 1] = updated[idx];
      updated[idx] = temp;
      setExercises(updated.map((ex, i) => Object.assign({}, ex, { id: i + 1 })));
      flashSaved();
    }

    function flashSaved() {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }

    function resetToDefault() {
      if (!window.confirm("Tem certeza que quer redefinir o Treino " + activeTab + " para os exercícios originais?")) return;
      if (activeTab === "A") {
        setTreinoA(S.TREINO_A_DEFAULT.map(e => Object.assign({}, e)));
      } else {
        setTreinoB(S.TREINO_B_DEFAULT.map(e => Object.assign({}, e)));
      }
      flashSaved();
    }

    const fieldStyle = {
      width: "100%", padding: "10px 12px", borderRadius: 10, boxSizing: "border-box",
      border: `1.5px solid ${COLORS.blue}60`, fontSize: 13, fontFamily: FONT_TEXT,
      color: COLORS.dark, background: COLORS.blueLight, outline: "none",
    };

    const labelSt = { fontSize: 11, fontWeight: 600, color: COLORS.grayText, fontFamily: FONT_TEXT, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4, display: "block" };

    function ExerciseForm(props) {
      const ex = props.ex;
      const setEx = props.setEx;
      const onSave = props.onSave;
      const onCancel = props.onCancel;
      const saveLabel = props.saveLabel || "Salvar";

      return h("div", { style: { background: COLORS.blueLight, borderRadius: 16, padding: 16, border: `1.5px solid ${COLORS.blue}30` } },
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 } },
          h("div", { style: { gridColumn: "1 / -1" } },
            h("label", { style: labelSt }, "Nome do exercício"),
            h("input", {
              value: ex.nome, placeholder: "Ex: Agachamento livre",
              onChange: (e) => setEx(Object.assign({}, ex, { nome: e.target.value })),
              style: fieldStyle,
            })
          ),
          h("div", null,
            h("label", { style: labelSt }, "Séries"),
            h("input", {
              type: "number", value: ex.series, min: "1", max: "10",
              onChange: (e) => setEx(Object.assign({}, ex, { series: parseInt(e.target.value) || 1 })),
              style: fieldStyle,
            })
          ),
          h("div", null,
            h("label", { style: labelSt }, "Repetições"),
            h("input", {
              value: ex.reps, placeholder: "Ex: 12 ou 30s",
              onChange: (e) => setEx(Object.assign({}, ex, { reps: e.target.value })),
              style: fieldStyle,
            })
          ),
          h("div", null,
            h("label", { style: labelSt }, "Descanso"),
            h("input", {
              value: ex.descanso, placeholder: "Ex: 60s",
              onChange: (e) => setEx(Object.assign({}, ex, { descanso: e.target.value })),
              style: fieldStyle,
            })
          ),
          h("div", null,
            h("label", { style: labelSt }, "Músculo"),
            h("input", {
              value: ex.musculo, placeholder: "Ex: Quadríceps",
              onChange: (e) => setEx(Object.assign({}, ex, { musculo: e.target.value })),
              style: fieldStyle,
            })
          ),
          h("div", { style: { gridColumn: "1 / -1" } },
            h("label", { style: labelSt }, "Emoji"),
            h("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 } },
              EMOJIS.map(em => h("button", {
                key: em,
                onClick: () => setEx(Object.assign({}, ex, { emoji: em })),
                style: {
                  fontSize: 22, background: ex.emoji === em ? COLORS.blue : COLORS.white,
                  border: `2px solid ${ex.emoji === em ? COLORS.blue : COLORS.grayMid}`,
                  borderRadius: 8, padding: 4, cursor: "pointer", lineHeight: 1,
                }
              }, em))
            )
          )
        ),
        h("div", { style: { display: "flex", gap: 8 } },
          h("button", {
            onClick: onCancel,
            style: { flex: 1, background: COLORS.white, border: `1.5px solid ${COLORS.grayMid}`, borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 600, color: COLORS.grayText, cursor: "pointer", fontFamily: FONT_TEXT }
          }, "Cancelar"),
          h("button", {
            onClick: onSave,
            disabled: !ex.nome.trim(),
            style: { flex: 2, background: ex.nome.trim() ? `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})` : COLORS.grayMid, border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, color: COLORS.white, cursor: ex.nome.trim() ? "pointer" : "default", fontFamily: FONT_TITLE }
          }, saveLabel)
        )
      );
    }

    return h("div", { style: { background: COLORS.white, minHeight: "100vh", paddingBottom: 40 } },

      // Header
      h("div", { style: { background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" } },
        h("button", {
          onClick: () => setScreen("profile"),
          style: { background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 14px", color: COLORS.white, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: FONT_TEXT }
        }, "← Voltar"),
        h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
          h("div", null,
            h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE, marginBottom: 4 } }, "✏️ Gerenciar Treinos"),
            h("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: FONT_TEXT } }, "Edite, adicione ou reordene exercícios")
          ),
          saved ? h("div", { style: { background: "rgba(87,200,77,0.25)", border: "1px solid rgba(87,200,77,0.5)", borderRadius: 10, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 } },
            h("span", { style: { fontSize: 14 } }, "✅"),
            h("span", { style: { fontSize: 12, color: "white", fontFamily: FONT_TEXT, fontWeight: 600 } }, "Salvo!")
          ) : null
        )
      ),

      h("div", { style: { padding: "20px 20px 0" } },

        // Info banner
        h("div", { style: { background: COLORS.blueLight, borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" } },
          h("span", { style: { fontSize: 18, flexShrink: 0 } }, "💡"),
          h("div", { style: { fontSize: 12, color: COLORS.blue, fontFamily: FONT_TEXT, lineHeight: 1.5 } },
            "Alterações são aplicadas imediatamente nas sessões. Use o botão Redefinir para voltar aos exercícios originais.")
        ),

        // Tab selector
        h("div", { style: { display: "flex", background: COLORS.gray, borderRadius: 14, padding: 4, marginBottom: 20, gap: 4 } },
          ["A", "B"].map(t => h("button", {
            key: t,
            onClick: () => { setActiveTab(t); setEditingIdx(null); setShowAddForm(false); },
            style: {
              flex: 1, padding: "12px", border: "none", borderRadius: 11, cursor: "pointer",
              background: activeTab === t ? COLORS.white : "transparent",
              color: activeTab === t ? COLORS.blue : COLORS.grayText,
              fontSize: 14, fontWeight: activeTab === t ? 700 : 400, fontFamily: FONT_TITLE,
              boxShadow: activeTab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s",
            }
          }, `Treino ${t}${activeTab === t ? (t === "A" ? " · Inf. + Core" : " · Sup. + Total") : ""}`))
        ),

        // Stats bar
        h("div", { style: { display: "flex", gap: 10, marginBottom: 20 } },
          h("div", { style: { flex: 1, background: COLORS.gray, borderRadius: 14, padding: "12px 16px", textAlign: "center" } },
            h("div", { style: { fontSize: 20, fontWeight: 700, color: COLORS.blue, fontFamily: FONT_TITLE } }, exercises.length),
            h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "Exercícios")
          ),
          h("div", { style: { flex: 1, background: COLORS.gray, borderRadius: 14, padding: "12px 16px", textAlign: "center" } },
            h("div", { style: { fontSize: 20, fontWeight: 700, color: COLORS.green, fontFamily: FONT_TITLE } },
              exercises.reduce((sum, ex) => sum + ex.series, 0)
            ),
            h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "Séries totais")
          ),
          h("div", { style: { flex: 1, background: COLORS.gray, borderRadius: 14, padding: "12px 16px", textAlign: "center" } },
            h("div", { style: { fontSize: 20, fontWeight: 700, color: COLORS.orange, fontFamily: FONT_TITLE } },
              Math.round(exercises.reduce((sum, ex) => sum + ex.series * 0.5, 0)) + "min"
            ),
            h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "Tempo est.")
          )
        ),

        // Exercise list
        h("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 } },
          exercises.map((ex, idx) => {

            // Editing mode for this exercise
            if (editingIdx === idx && editDraft) {
              return h("div", { key: idx },
                h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } },
                  h("div", { style: { width: 28, height: 28, borderRadius: 8, background: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", fontFamily: FONT_TITLE } }, idx + 1),
                  h("div", { style: { fontSize: 13, fontWeight: 700, color: COLORS.blue, fontFamily: FONT_TITLE } }, "Editando exercício...")
                ),
                h(ExerciseForm, {
                  ex: editDraft,
                  setEx: setEditDraft,
                  onSave: saveEdit,
                  onCancel: cancelEdit,
                  saveLabel: "Salvar alterações",
                })
              );
            }

            // Normal display
            return h("div", {
              key: idx,
              style: { background: COLORS.white, borderRadius: 18, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }
            },
              // Main row
              h("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" } },
                h("div", { style: { width: 36, height: 36, borderRadius: 10, background: COLORS.gray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 } }, ex.emoji),
                h("div", { style: { flex: 1, minWidth: 0 } },
                  h("div", { style: { fontSize: 13, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 2 } }, ex.nome),
                  h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } },
                    `${ex.series} séries × ${ex.reps} · descanso ${ex.descanso}`)
                ),
                h("div", { style: { fontSize: 10, background: COLORS.gray, padding: "4px 8px", borderRadius: 6, color: COLORS.grayText, fontFamily: FONT_TEXT, flexShrink: 0, maxWidth: 80, textAlign: "center" } }, ex.musculo)
              ),

              // Action bar
              h("div", { style: { display: "flex", borderTop: `1px solid ${COLORS.grayMid}`, background: COLORS.gray } },
                // Move up
                h("button", {
                  onClick: () => moveUp(idx),
                  disabled: idx === 0,
                  style: { flex: 1, padding: "9px 0", border: "none", background: "transparent", cursor: idx === 0 ? "default" : "pointer", fontSize: 16, opacity: idx === 0 ? 0.3 : 1, borderRight: `1px solid ${COLORS.grayMid}` }
                }, "↑"),
                // Move down
                h("button", {
                  onClick: () => moveDown(idx),
                  disabled: idx === exercises.length - 1,
                  style: { flex: 1, padding: "9px 0", border: "none", background: "transparent", cursor: idx === exercises.length - 1 ? "default" : "pointer", fontSize: 16, opacity: idx === exercises.length - 1 ? 0.3 : 1, borderRight: `1px solid ${COLORS.grayMid}` }
                }, "↓"),
                // Edit
                h("button", {
                  onClick: () => startEdit(idx),
                  style: { flex: 2, padding: "9px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, color: COLORS.blue, fontFamily: FONT_TEXT, borderRight: `1px solid ${COLORS.grayMid}` }
                }, "✏️ Editar"),
                // Delete
                h("button", {
                  onClick: () => {
                    if (window.confirm(`Remover "${ex.nome}" do Treino ${activeTab}?`)) deleteExercise(idx);
                  },
                  disabled: exercises.length <= 1,
                  style: { flex: 1, padding: "9px 0", border: "none", background: "transparent", cursor: exercises.length <= 1 ? "default" : "pointer", fontSize: 16, opacity: exercises.length <= 1 ? 0.3 : 1, color: COLORS.red }
                }, "🗑️")
              )
            );
          })
        ),

        // Add new exercise
        showAddForm
          ? h("div", { style: { marginBottom: 16 } },
              h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 10 } }, "➕ Novo exercício"),
              h(ExerciseForm, {
                ex: newEx,
                setEx: setNewEx,
                onSave: addExercise,
                onCancel: () => { setShowAddForm(false); setNewEx(Object.assign({}, emptyExercise)); },
                saveLabel: "Adicionar exercício",
              })
            )
          : h("button", {
              onClick: () => { setShowAddForm(true); setEditingIdx(null); },
              style: {
                width: "100%", background: COLORS.white,
                border: `2px dashed ${COLORS.blue}60`,
                borderRadius: 18, padding: "16px",
                fontSize: 14, fontWeight: 700, color: COLORS.blue,
                cursor: "pointer", fontFamily: FONT_TITLE,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginBottom: 16,
              }
            },
              h("span", { style: { fontSize: 20 } }, "➕"),
              "Adicionar exercício"
            ),

        // Reset button
        h("button", {
          onClick: resetToDefault,
          style: {
            width: "100%", background: "transparent",
            border: `1.5px solid ${COLORS.red}40`,
            borderRadius: 16, padding: "14px",
            fontSize: 13, fontWeight: 600, color: COLORS.red,
            cursor: "pointer", fontFamily: FONT_TEXT,
          }
        }, "🔄 Redefinir Treino " + activeTab + " para os originais")
      )
    );
  }

  Object.assign(window.SerAtivo, { WorkoutManagerScreen });
})();
