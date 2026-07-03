// Ser Ativo Home Basic — Tela de Perfil (editável)
"use strict";

(function () {
  const S = window.SerAtivo;
  const h = S.h, useState = S.useState, useEffect = S.useEffect;
  const COLORS = S.COLORS, FONT_TITLE = S.FONT_TITLE, FONT_TEXT = S.FONT_TEXT;
  const AVATARS = S.AVATARS;

  function ProfileScreen({ setScreen, onProfileChange }) {
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [avatarPicker, setAvatarPicker] = useState(false);

    const [profile, setProfile] = useState({
      nome: "Maria Santos",
      id: "HC-2024-0042",
      idade: "68",
      telefone: "(81) 99999-0000",
      email: "maria.santos@email.com",
      diagnostico: "Insuficiência cardíaca",
      medico: "Dr. João Ferreira",
      lembrete1: "Terça",
      lembrete2: "Quinta",
      lembrete3: "Sábado",
      horario: "09:00",
      avatar: "👩",
      status: "Ativo",
    });

    useEffect(() => {
      if (onProfileChange) onProfileChange(profile);
    }, [profile]);

    const [draft, setDraft] = useState(Object.assign({}, profile));

    function startEdit() { setDraft(Object.assign({}, profile)); setEditing(true); setSaved(false); }
    function cancelEdit() { setDraft(Object.assign({}, profile)); setEditing(false); setAvatarPicker(false); }
    function saveEdit() {
      setProfile(Object.assign({}, draft));
      setEditing(false); setAvatarPicker(false); setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    function field(key) { return editing ? draft[key] : profile[key]; }
    function setField(key, val) { setDraft(d => Object.assign({}, d, { [key]: val })); }

    function inputStyle(active) {
      return {
        width: "100%", padding: "11px 14px", borderRadius: 12, boxSizing: "border-box",
        border: `1.5px solid ${active ? COLORS.blue : COLORS.grayMid}`,
        fontSize: 14, fontFamily: FONT_TEXT, color: COLORS.dark,
        background: active ? COLORS.blueLight : COLORS.gray,
        outline: "none", transition: "all 0.2s",
      };
    }

    const labelStyle = {
      fontSize: 11, fontWeight: 600, color: COLORS.grayText,
      fontFamily: FONT_TEXT, textTransform: "uppercase", letterSpacing: 0.8,
      marginBottom: 6, display: "block",
    };

    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

    return h("div", { style: { paddingBottom: 100 } },
      // Header
      h("div", { style: { background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 36px", borderRadius: "0 0 32px 32px" } },
        h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 14 } },

          h("div", { style: { position: "relative" } },
            h("div", {
              onClick: () => { if (editing) setAvatarPicker(v => !v); },
              style: {
                width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
                border: editing ? "3px solid rgba(255,255,255,0.9)" : "3px solid rgba(255,255,255,0.5)",
                cursor: editing ? "pointer" : "default", transition: "border 0.2s",
              }
            }, field("avatar")),
            editing ? h("div", {
              onClick: () => setAvatarPicker(v => !v),
              style: {
                position: "absolute", bottom: 0, right: 0,
                width: 26, height: 26, background: COLORS.white, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", cursor: "pointer",
              }
            }, "✏️") : null
          ),

          avatarPicker ? h("div", {
            style: { background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 12, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 260 }
          },
            AVATARS.map(a => h("button", {
              key: a,
              onClick: () => { setField("avatar", a); setAvatarPicker(false); },
              style: {
                fontSize: 28, background: draft.avatar === a ? COLORS.blueLight : "transparent",
                border: draft.avatar === a ? `2px solid ${COLORS.blue}` : "2px solid transparent",
                borderRadius: 10, padding: 6, cursor: "pointer", transition: "all 0.15s",
              }
            }, a))
          ) : null,

          editing ? h("div", { style: { width: "100%", maxWidth: 280, display: "flex", flexDirection: "column", gap: 8 } },
            h("input", {
              value: draft.nome, onChange: (e) => setField("nome", e.target.value),
              style: Object.assign({}, inputStyle(true), { textAlign: "center", fontSize: 16, fontWeight: 700, fontFamily: FONT_TITLE, background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.6)", color: COLORS.white })
            }),
            h("input", {
              value: draft.id, onChange: (e) => setField("id", e.target.value),
              style: Object.assign({}, inputStyle(false), { textAlign: "center", fontSize: 13, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.9)" })
            })
          ) : h("div", { style: { textAlign: "center" } },
            h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE } }, profile.nome),
            h("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: FONT_TEXT } }, `ID: ${profile.id}`)
          ),

          h("div", { style: { display: "flex", gap: 10 } },
            [
              { label: "anos", key: "idade", editable: true },
              { label: "programa", val: "8 sem", editable: false },
              { label: "status", key: "status", editable: true },
            ].map((chip, i) => h("div", {
              key: i,
              style: { background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", textAlign: "center" }
            },
              (editing && chip.editable)
                ? h("input", {
                    value: draft[chip.key], onChange: (e) => setField(chip.key, e.target.value),
                    style: { fontSize: 15, fontWeight: 700, background: "transparent", border: "none", color: COLORS.white, textAlign: "center", width: chip.key === "status" ? 52 : 36, outline: "none", fontFamily: FONT_TITLE }
                  })
                : h("div", { style: { fontSize: 15, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE } }, chip.val || profile[chip.key]),
              h("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: FONT_TEXT } }, chip.label)
            ))
          )
        )
      ),

      h("div", { style: { padding: "20px 20px 0" } },

        !editing ? h("div", { style: { display: "flex", gap: 10, marginBottom: 20 } },
          h("button", {
            onClick: startEdit,
            style: { flex: 1, background: COLORS.blueLight, border: `1.5px solid ${COLORS.blue}30`, borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, color: COLORS.blue, cursor: "pointer", fontFamily: FONT_TITLE }
          }, "✏️ Editar perfil"),
          saved ? h("div", {
            style: { display: "flex", alignItems: "center", gap: 6, padding: "0 16px", background: COLORS.greenLight, borderRadius: 14, border: `1.5px solid ${COLORS.green}40` }
          },
            h("span", { style: { fontSize: 16 } }, "✅"),
            h("span", { style: { fontSize: 13, fontWeight: 600, color: COLORS.green, fontFamily: FONT_TEXT } }, "Salvo!")
          ) : null
        ) : h("div", { style: { display: "flex", gap: 10, marginBottom: 20 } },
          h("button", {
            onClick: cancelEdit,
            style: { flex: 1, background: COLORS.gray, border: `1.5px solid ${COLORS.grayMid}`, borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 600, color: COLORS.darkMid, cursor: "pointer", fontFamily: FONT_TEXT }
          }, "Cancelar"),
          h("button", {
            onClick: saveEdit,
            style: { flex: 1, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`, border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, color: COLORS.white, cursor: "pointer", fontFamily: FONT_TITLE, boxShadow: `0 6px 20px ${COLORS.blue}40` }
          }, "✓ Salvar")
        ),

        // Dados pessoais
        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 14, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" } },
          h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 } }, "👤 Dados pessoais"),
          h("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
            [
              { label: "Nome completo", key: "nome" },
              { label: "Telefone", key: "telefone" },
              { label: "E-mail", key: "email" },
            ].map(f => h("div", { key: f.key },
              h("label", { style: labelStyle }, f.label),
              editing
                ? h("input", { value: draft[f.key], onChange: (e) => setField(f.key, e.target.value), style: inputStyle(true) })
                : h("div", { style: { fontSize: 14, color: COLORS.dark, fontFamily: FONT_TEXT, padding: "10px 0", borderBottom: `1px solid ${COLORS.grayMid}` } }, profile[f.key])
            ))
          )
        ),

        // Dados clínicos
        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 14, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" } },
          h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 } }, "🏥 Dados clínicos"),
          h("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
            [
              { label: "Diagnóstico principal", key: "diagnostico" },
              { label: "Médico responsável", key: "medico" },
            ].map(f => h("div", { key: f.key },
              h("label", { style: labelStyle }, f.label),
              editing
                ? h("input", { value: draft[f.key], onChange: (e) => setField(f.key, e.target.value), style: inputStyle(true) })
                : h("div", { style: { fontSize: 14, color: COLORS.dark, fontFamily: FONT_TEXT, padding: "10px 0", borderBottom: `1px solid ${COLORS.grayMid}` } }, profile[f.key])
            ))
          )
        ),

        // Lembretes
        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 14, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" } },
          h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 } }, "🔔 Lembretes de treino"),
          h("label", { style: labelStyle }, "Dias da semana"),
          h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 } },
            days.map(d => {
              const currentSlots = editing ? [draft.lembrete1, draft.lembrete2, draft.lembrete3] : [profile.lembrete1, profile.lembrete2, profile.lembrete3];
              const isSelected = currentSlots.includes(d);
              return h("button", {
                key: d,
                onClick: () => {
                  if (!editing) return;
                  const slots = [draft.lembrete1, draft.lembrete2, draft.lembrete3];
                  const keys = ["lembrete1", "lembrete2", "lembrete3"];
                  if (isSelected) {
                    const idx = slots.indexOf(d);
                    setField(keys[idx], "");
                  } else {
                    const emptyIdx = slots.indexOf("");
                    if (emptyIdx !== -1) setField(keys[emptyIdx], d);
                  }
                },
                style: {
                  padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  fontFamily: FONT_TEXT, cursor: editing ? "pointer" : "default",
                  background: isSelected ? COLORS.blueLight : COLORS.gray,
                  color: isSelected ? COLORS.blue : COLORS.grayText,
                  border: `1.5px solid ${isSelected ? COLORS.blue + "50" : COLORS.grayMid}`,
                  transition: "all 0.15s",
                }
              }, d.slice(0, 3));
            })
          ),
          h("label", { style: labelStyle }, "Horário"),
          editing
            ? h("input", { type: "time", value: draft.horario, onChange: (e) => setField("horario", e.target.value), style: inputStyle(true) })
            : h("div", { style: { fontSize: 16, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE } }, profile.horario)
        ),

        // Menu items
        [
          { icon: "📄", title: "Relatórios da equipe", sub: "Visualizar e exportar PDF", action: () => setScreen && setScreen("report") },
          { icon: "✏️", title: "Gerenciar Treinos", sub: "Editar exercícios, séries e repetições", action: () => setScreen && setScreen("workout-manager") },
          { icon: "🎬", title: "Vídeos dos exercícios", sub: "Gerenciar links de demonstração", action: () => setScreen && setScreen("video-manager") },
          { icon: "❓", title: "Dúvidas frequentes", sub: "Perguntas sobre os treinos", action: null },
          { icon: "🛡️", title: "Privacidade e dados", sub: "Suas informações estão seguras", action: null },
        ].map((item, i) => h("div", {
          key: i,
          onClick: item.action || undefined,
          style: {
            background: COLORS.white, borderRadius: 18, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
            border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            cursor: item.action ? "pointer" : "default",
          }
        },
          h("div", { style: { width: 44, height: 44, background: COLORS.gray, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 } }, item.icon),
          h("div", { style: { flex: 1 } },
            h("div", { style: { fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: FONT_TITLE } }, item.title),
            h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } }, item.sub)
          ),
          h("div", { style: { color: COLORS.grayText, fontSize: 18 } }, "›")
        )),

        // WhatsApp contact card
        h("a", { href: "https://wa.me/558121263960", target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none" } },
          h("div", {
            style: {
              background: "#EDFBF0", borderRadius: 18, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
              border: "1.5px solid #25D36630", boxShadow: "0 2px 8px rgba(37,211,102,0.08)",
              cursor: "pointer",
            }
          },
            h("div", { style: { width: 44, height: 44, background: "#25D366", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 } }, "💬"),
            h("div", { style: { flex: 1 } },
              h("div", { style: { fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: FONT_TITLE } }, "Contato da equipe"),
              h("div", { style: { fontSize: 12, color: "#25D366", fontWeight: 600, fontFamily: FONT_TEXT } }, "Educação Física · (81) 2126-3960"),
              h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT, marginTop: 1 } }, "Atendimento via WhatsApp")
            ),
            h("div", { style: { fontSize: 20 } }, "›")
          )
        ),

        h("div", { style: { background: `linear-gradient(135deg, ${COLORS.blue}10, ${COLORS.green}10)`, borderRadius: 18, padding: "16px 20px", marginTop: 4, border: `1px solid ${COLORS.blue}20` } },
          h("div", { style: { fontSize: 12, color: COLORS.blue, fontWeight: 700, fontFamily: FONT_TEXT, marginBottom: 4 } }, "🏥 Hospital das Clínicas · UFPE"),
          h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } },
            "Programa de atividades físicas domiciliar. Em caso de desconforto, pare o exercício imediatamente.")
        )
      )
    );
  }

  Object.assign(window.SerAtivo, { ProfileScreen });
})();
