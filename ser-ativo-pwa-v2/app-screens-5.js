// Ser Ativo Home Basic — Tela de Relatório (visualização + exportação PDF)
"use strict";

(function () {
  const S = window.SerAtivo;
  const h = S.h, useState = S.useState;
  const COLORS = S.COLORS, FONT_TITLE = S.FONT_TITLE, FONT_TEXT = S.FONT_TEXT;
  const BORG_SCALE = S.BORG_SCALE;

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r, g, b];
  }

  function ReportScreen({ setScreen, completedSessions, borgRatings, profile }) {
    const [period, setPeriod] = useState("mensal");
    const [exporting, setExporting] = useState(false);
    const [exported, setExported] = useState(false);
    const [exportError, setExportError] = useState(null);

    const nome = (profile && profile.nome) || "Maria Santos";
    const id = (profile && profile.id) || "HC-2024-0042";
    const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

    const totalSessoes = completedSessions.length;
    const pctAdesao = Math.round((totalSessoes / 32) * 100);
    const totalMins = totalSessoes * 37;
    const avgBorg = borgRatings.length > 0
      ? (borgRatings.reduce((a, b) => a + b.borg, 0) / borgRatings.length).toFixed(1)
      : "—";

    const sessoesNaoRealizadas = 32 - totalSessoes;
    const weeklyData = [0, 0, 0, 0, 0, 0, 0, 0];
    completedSessions.forEach(sid => {
      const idx = Math.min(Math.floor((sid - 1) / 4), 7);
      weeklyData[idx]++;
    });

    const borgEvolution = borgRatings.slice(-8);
    const ultimaData = totalSessoes > 0 ? new Date().toLocaleDateString("pt-BR") : "—";

    function exportPDF() {
      setExportError(null);
      if (!window.jspdf || !window.jspdf.jsPDF) {
        setExportError("Biblioteca de PDF ainda carregando. Tente novamente em alguns segundos.");
        return;
      }
      setExporting(true);

      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        const azul = hexToRgb(COLORS.blue);
        const verde = hexToRgb(COLORS.green);
        const cinza = hexToRgb(COLORS.gray);
        const dark = hexToRgb(COLORS.dark);
        const grayText = hexToRgb(COLORS.grayText);

        doc.setFillColor(azul[0], azul[1], azul[2]);
        doc.rect(0, 0, 210, 48, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Ser Ativo Home Basic", 14, 18);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Relatório de Acompanhamento — HC-UFPE", 14, 26);
        doc.text(`Gerado em: ${hoje}`, 14, 33);

        doc.setFontSize(9);
        doc.text(`Paciente: ${nome}   |   ID: ${id}`, 14, 41);

        doc.setDrawColor(verde[0], verde[1], verde[2]);
        doc.setLineWidth(1.2);
        doc.line(14, 52, 196, 52);

        const metrics = [
          { label: "Sessões realizadas", value: `${totalSessoes}/32` },
          { label: "Taxa de adesão", value: `${pctAdesao}%` },
          { label: "Tempo total", value: `${totalMins} min` },
          { label: "Borg médio", value: avgBorg },
        ];

        const cardW = 42, cardH = 22, cardGap = 4;
        const startX = 14, cardY = 58;

        metrics.forEach((m, i) => {
          const x = startX + i * (cardW + cardGap);
          doc.setFillColor(cinza[0], cinza[1], cinza[2]);
          doc.roundedRect(x, cardY, cardW, cardH, 3, 3, "F");
          doc.setTextColor(dark[0], dark[1], dark[2]);
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(m.value, x + cardW / 2, cardY + 11, { align: "center" });
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(grayText[0], grayText[1], grayText[2]);
          doc.text(m.label, x + cardW / 2, cardY + 18, { align: "center" });
        });

        let y = 90;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(dark[0], dark[1], dark[2]);
        doc.text("Adesão ao Programa", 14, y);
        y += 6;

        doc.setFillColor(cinza[0], cinza[1], cinza[2]);
        doc.roundedRect(14, y, 182, 26, 3, 3, "F");

        const rows = [
          ["Sessões concluídas", `${totalSessoes}`],
          ["Sessões pendentes", `${sessoesNaoRealizadas}`],
          ["Última sessão realizada", ultimaData],
        ];
        doc.setFontSize(9);
        rows.forEach((r, i) => {
          const ry = y + 7 + i * 7;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(grayText[0], grayText[1], grayText[2]);
          doc.text(r[0], 20, ry);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(dark[0], dark[1], dark[2]);
          doc.text(r[1], 160, ry, { align: "right" });
        });
        y += 32;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(grayText[0], grayText[1], grayText[2]);
        doc.text("Progresso geral:", 14, y);
        doc.setFillColor(226, 230, 240);
        doc.roundedRect(14, y + 2, 182, 6, 3, 3, "F");
        doc.setFillColor(verde[0], verde[1], verde[2]);
        doc.roundedRect(14, y + 2, (182 * pctAdesao) / 100, 6, 3, 3, "F");
        doc.setTextColor(dark[0], dark[1], dark[2]);
        doc.setFont("helvetica", "bold");
        doc.text(`${pctAdesao}%`, 200, y + 7, { align: "right" });
        y += 16;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(dark[0], dark[1], dark[2]);
        doc.text("Sessões por Semana", 14, y);
        y += 6;

        const barMaxH = 20, barW = 18, barGap = 4;
        const maxVal = Math.max.apply(null, weeklyData.concat([1]));
        weeklyData.forEach((v, i) => {
          const x = 14 + i * (barW + barGap);
          const hgt = v === 0 ? 2 : (v / maxVal) * barMaxH;
          const by = y + barMaxH - hgt;
          if (i < 2) doc.setFillColor(azul[0], azul[1], azul[2]);
          else if (i < 4) doc.setFillColor(verde[0], verde[1], verde[2]);
          else doc.setFillColor(226, 230, 240);
          doc.roundedRect(x, by, barW, hgt, 2, 2, "F");
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(grayText[0], grayText[1], grayText[2]);
          doc.text(`S${i + 1}`, x + barW / 2, y + barMaxH + 5, { align: "center" });
          if (v > 0) {
            doc.setTextColor(dark[0], dark[1], dark[2]);
            doc.text(`${v}`, x + barW / 2, by - 1, { align: "center" });
          }
        });
        y += barMaxH + 14;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(dark[0], dark[1], dark[2]);
        doc.text("Evolução da Percepção de Esforço (Borg)", 14, y);
        y += 6;

        if (borgEvolution.length > 0) {
          borgEvolution.forEach((b, i) => {
            const x = 14 + i * 22;
            const hgt = (b.borg / 10) * 20;
            const borgColorHex = (BORG_SCALE[b.borg] && BORG_SCALE[b.borg].color) || COLORS.blue;
            const rgb = hexToRgb(borgColorHex);
            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            doc.roundedRect(x, y + 20 - hgt, 16, hgt, 2, 2, "F");
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(grayText[0], grayText[1], grayText[2]);
            doc.text(`S${b.session}`, x + 8, y + 25, { align: "center" });
            doc.setTextColor(dark[0], dark[1], dark[2]);
            doc.text(`${b.borg}`, x + 8, y + 20 - hgt - 1, { align: "center" });
          });
          y += 34;
        } else {
          doc.setFontSize(9);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(grayText[0], grayText[1], grayText[2]);
          doc.text("Nenhuma avaliação de Borg registrada ainda.", 14, y + 8);
          y += 18;
        }

        const withObs = borgRatings.filter(b => b.obs);
        if (withObs.length > 0) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(dark[0], dark[1], dark[2]);
          doc.text("Observações do Paciente", 14, y);
          y += 6;
          withObs.slice(-4).forEach(b => {
            doc.setFillColor(cinza[0], cinza[1], cinza[2]);
            doc.roundedRect(14, y, 182, 14, 3, 3, "F");
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(dark[0], dark[1], dark[2]);
            doc.text(`Sessão ${b.session} (Borg ${b.borg}):`, 18, y + 6);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(grayText[0], grayText[1], grayText[2]);
            const obsText = doc.splitTextToSize(b.obs, 140);
            doc.text(obsText[0] || "", 18, y + 11);
            y += 18;
          });
        }

        doc.setFillColor(azul[0], azul[1], azul[2]);
        doc.rect(0, 277, 210, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Ser Ativo Home Basic · Hospital das Clínicas · UFPE · Educação Física", 105, 285, { align: "center" });
        doc.text("(81) 2126-3960 · Programa de atividades físicas domiciliar", 105, 291, { align: "center" });

        const fileName = `relatorio_ser_ativo_${nome.split(" ")[0].toLowerCase()}.pdf`;
        doc.save(fileName);

        setExporting(false);
        setExported(true);
        setTimeout(() => setExported(false), 3000);
      } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        setExportError("Não foi possível gerar o PDF. Tente novamente.");
        setExporting(false);
      }
    }

    function StatCard(props) {
      return h("div", {
        style: { background: COLORS.white, borderRadius: 18, padding: "16px", border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.07)" }
      },
        h("div", { style: { fontSize: 20, marginBottom: 6 } }, props.icon),
        h("div", { style: { fontSize: 22, fontWeight: 700, color: props.color || COLORS.dark, fontFamily: FONT_TITLE } }, props.value),
        h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT } }, props.label)
      );
    }

    return h("div", { style: { background: COLORS.white, minHeight: "100vh", paddingBottom: 40 } },
      h("div", { style: { background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" } },
        h("button", {
          onClick: () => setScreen("profile"),
          style: { background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 14px", color: COLORS.white, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: FONT_TEXT }
        }, "← Voltar"),
        h("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: FONT_TITLE, marginBottom: 4 } }, "📄 Relatório da Equipe"),
        h("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: FONT_TEXT } }, `${nome} · ${id}`),
        h("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: FONT_TEXT, marginTop: 2 } }, `Gerado em ${hoje}`)
      ),

      h("div", { style: { padding: "24px 20px 0" } },

        h("div", { style: { display: "flex", background: COLORS.gray, borderRadius: 14, padding: 4, marginBottom: 24, gap: 4 } },
          ["semanal", "mensal", "total"].map(p => h("button", {
            key: p,
            onClick: () => setPeriod(p),
            style: {
              flex: 1, padding: "10px 6px", border: "none", borderRadius: 11, cursor: "pointer",
              background: period === p ? COLORS.white : "transparent",
              color: period === p ? COLORS.blue : COLORS.grayText,
              fontSize: 13, fontWeight: period === p ? 700 : 400,
              fontFamily: FONT_TEXT,
              boxShadow: period === p ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s",
            }
          }, p.charAt(0).toUpperCase() + p.slice(1)))
        ),

        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 } },
          h(StatCard, { icon: "✅", label: "Sessões realizadas", value: `${totalSessoes}/32`, color: COLORS.blue }),
          h(StatCard, { icon: "📊", label: "Taxa de adesão", value: `${pctAdesao}%`, color: pctAdesao >= 75 ? COLORS.green : pctAdesao >= 50 ? COLORS.orange : COLORS.red }),
          h(StatCard, { icon: "⏱️", label: "Tempo total", value: `${totalMins}min` }),
          h(StatCard, { icon: "💓", label: "Borg médio", value: avgBorg })
        ),

        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.06)" } },
          h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 16 } }, "Adesão ao Programa"),
          [
            { label: "Sessões concluídas", value: totalSessoes, color: COLORS.green },
            { label: "Sessões pendentes", value: sessoesNaoRealizadas, color: COLORS.grayText },
            { label: "Última sessão", value: ultimaData, color: COLORS.blue },
          ].map((row, i, arr) => h("div", {
            key: i,
            style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.grayMid}` : "none" }
          },
            h("span", { style: { fontSize: 13, color: COLORS.grayText, fontFamily: FONT_TEXT } }, row.label),
            h("span", { style: { fontSize: 15, fontWeight: 700, color: row.color, fontFamily: FONT_TITLE } }, row.value)
          )),
          h("div", { style: { marginTop: 14 } },
            h("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 6 } },
              h("span", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } }, "Progresso geral"),
              h("span", { style: { fontSize: 12, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TEXT } }, `${pctAdesao}%`)
            ),
            h("div", { style: { height: 8, background: COLORS.grayMid, borderRadius: 4 } },
              h("div", { style: { height: "100%", width: `${pctAdesao}%`, background: pctAdesao >= 75 ? COLORS.green : pctAdesao >= 50 ? COLORS.orange : COLORS.red, borderRadius: 4, transition: "width 0.6s" } })
            )
          )
        ),

        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.06)" } },
          h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 4 } }, "Sessões por semana"),
          h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT, marginBottom: 16 } }, "Meta: 4 sessões/semana"),
          h("div", { style: { display: "flex", alignItems: "flex-end", gap: 8, height: 90 } },
            weeklyData.map((v, i) => h("div", {
              key: i,
              style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }
            },
              h("div", { style: { fontSize: 11, color: v >= 4 ? COLORS.green : COLORS.grayText, fontFamily: FONT_TEXT, fontWeight: v >= 4 ? 700 : 400 } }, v),
              h("div", { style: { width: "100%", height: v === 0 ? 4 : `${(v / 4) * 68}px`, background: v >= 4 ? COLORS.green : v >= 2 ? COLORS.blue : COLORS.grayMid, borderRadius: 6, transition: "height 0.5s" } }),
              h("div", { style: { fontSize: 10, color: COLORS.grayText, fontFamily: FONT_TEXT } }, `S${i + 1}`)
            ))
          ),
          h("div", { style: { display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" } },
            [{ color: COLORS.green, label: "Meta atingida (4)" }, { color: COLORS.blue, label: "Parcial (2–3)" }, { color: COLORS.grayMid, label: "Abaixo (0–1)" }].map((l, i) => h("div", {
              key: i,
              style: { display: "flex", alignItems: "center", gap: 5 }
            },
              h("div", { style: { width: 10, height: 10, borderRadius: 3, background: l.color } }),
              h("span", { style: { fontSize: 10, color: COLORS.grayText, fontFamily: FONT_TEXT } }, l.label)
            ))
          )
        ),

        h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.06)" } },
          h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 4 } }, "Percepção de Esforço (Borg)"),
          h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT, marginBottom: 16 } }, "Alvo: entre 3 e 6 por sessão"),
          borgEvolution.length > 0
            ? h("div", null,
                h("div", { style: { display: "flex", alignItems: "flex-end", gap: 8, height: 80 } },
                  borgEvolution.map((b, i) => h("div", {
                    key: i,
                    style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }
                  },
                    h("div", { style: { fontSize: 11, color: COLORS.dark, fontFamily: FONT_TEXT, fontWeight: 700 } }, b.borg),
                    h("div", { style: { width: "100%", height: `${(b.borg / 10) * 62}px`, background: (BORG_SCALE[b.borg] && BORG_SCALE[b.borg].color) || COLORS.blue, borderRadius: 6 } }),
                    h("div", { style: { fontSize: 10, color: COLORS.grayText, fontFamily: FONT_TEXT } }, `S${b.session}`)
                  ))
                ),
                h("div", { style: { marginTop: 14, background: COLORS.gray, borderRadius: 12, padding: "10px 14px" } },
                  h("div", { style: { fontSize: 12, color: COLORS.grayText, fontFamily: FONT_TEXT } },
                    "Borg médio: ", h("strong", { style: { color: COLORS.dark } }, avgBorg), " · ",
                    "Última avaliação: ", h("strong", { style: { color: COLORS.dark } },
                      `${borgEvolution[borgEvolution.length - 1].borg} (${(BORG_SCALE[borgEvolution[borgEvolution.length - 1].borg] || {}).label || ""})`)
                  )
                )
              )
            : h("div", { style: { textAlign: "center", padding: "20px 0", color: COLORS.grayText, fontSize: 13, fontFamily: FONT_TEXT } }, "Nenhuma avaliação registrada ainda.")
        ),

        borgRatings.some(b => b.obs) ? h("div", { style: { background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.06)" } },
          h("div", { style: { fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: FONT_TITLE, marginBottom: 14 } }, "Observações do Paciente"),
          h("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
            borgRatings.filter(b => b.obs).slice(-4).map((b, i) => h("div", {
              key: i,
              style: { background: COLORS.gray, borderRadius: 14, padding: "12px 14px" }
            },
              h("div", { style: { fontSize: 11, fontWeight: 700, color: COLORS.blue, fontFamily: FONT_TEXT, marginBottom: 4 } },
                `Sessão ${b.session} · Borg ${b.borg} — ${(BORG_SCALE[b.borg] || {}).label || ""}`),
              h("div", { style: { fontSize: 13, color: COLORS.dark, fontFamily: FONT_TEXT } }, b.obs)
            ))
          )
        ) : null,

        exportError ? h("div", {
          style: { background: "#FFF0F0", border: "1.5px solid #FF475730", borderRadius: 14, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: COLORS.red, fontFamily: FONT_TEXT }
        }, exportError) : null,

        h("button", {
          onClick: exportPDF,
          disabled: exporting,
          style: {
            width: "100%",
            background: exported ? `linear-gradient(135deg, ${COLORS.green}, #6DD65A)` : `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
            border: "none", borderRadius: 18, padding: "20px",
            fontSize: 16, fontWeight: 700, color: COLORS.white, cursor: "pointer",
            fontFamily: FONT_TITLE, boxShadow: `0 8px 24px ${COLORS.blue}40`,
            transition: "background 0.3s", opacity: exporting ? 0.7 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }
        },
          h("span", { style: { fontSize: 20 } }, exported ? "✅" : exporting ? "⏳" : "📥"),
          exported ? "PDF exportado!" : exporting ? "Gerando PDF..." : "Exportar PDF para a equipe"
        ),

        h("div", { style: { fontSize: 11, color: COLORS.grayText, fontFamily: FONT_TEXT, textAlign: "center", marginTop: 10, marginBottom: 24 } },
          "O PDF será salvo no seu dispositivo e pode ser enviado à equipe pelo WhatsApp.")
      )
    );
  }

  Object.assign(window.SerAtivo, { ReportScreen });
})();
