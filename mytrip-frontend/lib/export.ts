/**
 * Funções para exportar roteiros em formatos legíveis no telemóvel
 */

import { SavedTrip } from './storage';
import jsPDF from 'jspdf';

/**
 * Exporta roteiro para ficheiro de texto formatado
 * Perfeito para ler no telemóvel (Google Drive, WhatsApp, etc.)
 */
export function exportTripToText(trip: SavedTrip): void {
  try {
    const content = generateTextContent(trip);
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const filename = sanitizeFilename(trip.region);
    link.download = `roteiro-${filename}-${trip.duration_days}dias.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Roteiro exportado para texto');
  } catch (error) {
    console.error('Erro ao exportar roteiro:', error);
    alert('Erro ao exportar roteiro. Tente novamente.');
  }
}

/**
 * Exporta roteiro para formato Markdown
 * Ótimo para visualizar em apps como Notion, Obsidian
 */
export function exportTripToMarkdown(trip: SavedTrip): void {
  try {
    const content = generateMarkdownContent(trip);
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const filename = sanitizeFilename(trip.region);
    link.download = `roteiro-${filename}-${trip.duration_days}dias.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Roteiro exportado para Markdown');
  } catch (error) {
    console.error('Erro ao exportar roteiro:', error);
    alert('Erro ao exportar roteiro. Tente novamente.');
  }
}

/**
 * Gera conteúdo em texto simples
 */
function generateTextContent(trip: SavedTrip): string {
  let text = '';
  
  // Cabeçalho
  text += '═'.repeat(60) + '\n';
  text += `🗺️  ROTEIRO DE VIAGEM - ${trip.region.toUpperCase()}\n`;
  text += '═'.repeat(60) + '\n\n';
  
  // Informações gerais
  text += `📅 Duração: ${trip.duration_days} ${trip.duration_days === 1 ? 'dia' : 'dias'}\n`;
  if (trip.budget) {
    text += `💰 Orçamento: ${trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}\n`;
  }
  if (trip.estimated_cost) {
    text += `💵 Custo Estimado: ${trip.estimated_cost}\n`;
  }
  if (trip.best_season) {
    text += `🌤️  Melhor Época: ${trip.best_season}\n`;
  }
  text += `📆 Criado em: ${new Date(trip.created_at).toLocaleDateString('pt-PT')}\n`;
  text += '\n';
  
  // Itinerário
  trip.itinerary.forEach((day) => {
    text += '\n' + '─'.repeat(60) + '\n';
    text += `📍 DIA ${day.day}: ${day.title}\n`;
    text += '─'.repeat(60) + '\n\n';
    
    // Orçamento do dia
    if (day.daily_budget) {
      text += `💰 Orçamento do dia: ${day.daily_budget}\n\n`;
    }
    
    // Lugares
    text += '🏛️  LUGARES PARA VISITAR:\n\n';
    day.places.forEach((place: any, index: number) => {
      text += `${index + 1}. ${place.name}\n`;
      if (place.start_time && place.end_time) {
        text += `   ⏰ Horário: ${place.start_time} - ${place.end_time} (${place.duration})\n`;
      } else {
        text += `   ⏱️  Duração: ${place.duration}\n`;
      }
      text += `   📝 ${place.description}\n`;
      if (place.entrance_fee) {
        text += `   🎫 Entrada: ${place.entrance_fee}\n`;
      }
      if (place.tips) {
        text += `   💡 Dica: ${place.tips}\n`;
      }
      text += '\n';
    });
    
    // Refeições
    if (day.meals && day.meals.length > 0) {
      text += '\n🍽️  REFEIÇÕES:\n\n';
      day.meals.forEach((meal: any) => {
        text += `${meal.type} (${meal.time})\n`;
        text += `   🏪 ${meal.restaurant}\n`;
        text += `   🍴 ${meal.suggestion}\n`;
        text += `   💵 ${meal.estimated_cost}\n`;
        if (meal.location) {
          text += `   📍 ${meal.location}\n`;
        }
        text += '\n';
      });
    }
    
    // Alojamento
    if (day.accommodation_suggestion) {
      text += `\n🏨 ALOJAMENTO: ${day.accommodation_suggestion}\n`;
    }
  });
  
  // Dicas gerais
  if (trip.general_tips && trip.general_tips.length > 0) {
    text += '\n\n' + '═'.repeat(60) + '\n';
    text += '💡 DICAS IMPORTANTES\n';
    text += '═'.repeat(60) + '\n\n';
    trip.general_tips.forEach((tip, index) => {
      text += `${index + 1}. ${tip}\n`;
    });
  }
  
  // Rodapé
  text += '\n\n' + '═'.repeat(60) + '\n';
  text += '🌍 Gerado por MyTrip - Planeador de Viagens com IA\n';
  text += '═'.repeat(60) + '\n';
  
  return text;
}

/**
 * Gera conteúdo em Markdown
 */
function generateMarkdownContent(trip: SavedTrip): string {
  let md = '';
  
  // Cabeçalho
  md += `# 🗺️ ${trip.region}\n\n`;
  md += `> Roteiro de viagem de ${trip.duration_days} ${trip.duration_days === 1 ? 'dia' : 'dias'}\n\n`;
  
  // Informações gerais
  md += `## 📋 Informações Gerais\n\n`;
  md += `- **Duração:** ${trip.duration_days} ${trip.duration_days === 1 ? 'dia' : 'dias'}\n`;
  if (trip.budget) {
    md += `- **Orçamento:** ${trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}\n`;
  }
  if (trip.estimated_cost) {
    md += `- **Custo Estimado:** ${trip.estimated_cost}\n`;
  }
  if (trip.best_season) {
    md += `- **Melhor Época:** ${trip.best_season}\n`;
  }
  md += `- **Criado em:** ${new Date(trip.created_at).toLocaleDateString('pt-PT')}\n\n`;
  
  // Itinerário
  md += `## 📅 Itinerário\n\n`;
  
  trip.itinerary.forEach((day) => {
    md += `### 📍 Dia ${day.day}: ${day.title}\n\n`;
    
    if (day.daily_budget) {
      md += `**💰 Orçamento do dia:** ${day.daily_budget}\n\n`;
    }
    
    // Lugares
    md += `#### 🏛️ Lugares para Visitar\n\n`;
    day.places.forEach((place: any, index: number) => {
      md += `${index + 1}. **${place.name}**\n`;
      if (place.start_time && place.end_time) {
        md += `   - ⏰ **Horário:** ${place.start_time} - ${place.end_time} (${place.duration})\n`;
      } else {
        md += `   - ⏱️ **Duração:** ${place.duration}\n`;
      }
      md += `   - 📝 ${place.description}\n`;
      if (place.entrance_fee) {
        md += `   - 🎫 **Entrada:** ${place.entrance_fee}\n`;
      }
      if (place.tips) {
        md += `   - 💡 **Dica:** ${place.tips}\n`;
      }
      md += '\n';
    });
    
    // Refeições
    if (day.meals && day.meals.length > 0) {
      md += `#### 🍽️ Refeições\n\n`;
      md += '| Refeição | Horário | Restaurante | Sugestão | Custo |\n';
      md += '|----------|---------|-------------|----------|-------|\n';
      day.meals.forEach((meal: any) => {
        md += `| ${meal.type} | ${meal.time} | ${meal.restaurant} | ${meal.suggestion} | ${meal.estimated_cost} |\n`;
      });
      md += '\n';
    }
    
    // Alojamento
    if (day.accommodation_suggestion) {
      md += `#### 🏨 Alojamento\n\n`;
      md += `${day.accommodation_suggestion}\n\n`;
    }
    
    md += '---\n\n';
  });
  
  // Dicas gerais
  if (trip.general_tips && trip.general_tips.length > 0) {
    md += `## 💡 Dicas Importantes\n\n`;
    trip.general_tips.forEach((tip) => {
      md += `- ${tip}\n`;
    });
    md += '\n';
  }
  
  // Rodapé
  md += `---\n\n`;
  md += `*🌍 Gerado por MyTrip - Planeador de Viagens com IA*\n`;
  
  return md;
}

/**
 * Remove caracteres inválidos do nome do ficheiro
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Copia roteiro para clipboard (útil para partilhar)
 */
export async function copyTripToClipboard(trip: SavedTrip): Promise<void> {
  try {
    const content = generateTextContent(trip);
    await navigator.clipboard.writeText(content);
    alert('✅ Roteiro copiado! Pode colar em WhatsApp, email, etc.');
  } catch (error) {
    console.error('Erro ao copiar roteiro:', error);
    alert('Erro ao copiar roteiro. Tente usar o botão de exportar.');
  }
}

/**
 * Exporta roteiro para PDF
 * Formato profissional e fácil de partilhar
 */
export function exportTripToPDF(trip: SavedTrip): void {
  try {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Função para adicionar nova página se necessário
    const checkNewPage = (requiredSpace: number = 20) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Função para adicionar texto com quebra de linha (sem emojis)
    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      // Remove emojis para evitar problemas de codificação
      const cleanText = text.replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
      const lines = doc.splitTextToSize(cleanText, maxWidth);
      
      lines.forEach((line: string) => {
        checkNewPage();
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 2;
    };

    // Cabeçalho
    doc.setFillColor(99, 102, 241); // Indigo
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ROTEIRO DE VIAGEM', margin, 20);
    doc.setFontSize(12);
    doc.text(`${trip.region} - ${trip.duration_days} ${trip.duration_days === 1 ? 'dia' : 'dias'}`, margin, 30);

    // Resetar cor do texto
    doc.setTextColor(0, 0, 0);
    yPosition = 50;

    // Informações principais
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, yPosition, maxWidth, 35, 'F');
    yPosition += 8;
    
    // Traduzir budget
    const budgetText = trip.budget === 'low' ? 'Economico' : 
                      trip.budget === 'medium' ? 'Medio' : 
                      trip.budget === 'high' ? 'Premium' : trip.budget || 'N/A';
    
    addText(`Orcamento: ${budgetText}`, 11, true);
    if (trip.estimated_cost) {
      addText(`Custo estimado: ${trip.estimated_cost}`, 10, false);
    }
    if (trip.interests && trip.interests.length > 0) {
      addText(`Interesses: ${trip.interests.join(', ')}`, 10, false);
    }
    if (trip.best_season) {
      addText(`Melhor epoca: ${trip.best_season}`, 10, false);
    }
    yPosition += 5;

    // Itinerário por dia
    trip.itinerary.forEach((day: any, index: number) => {
      checkNewPage(30);
      
      // Título do dia
      doc.setFillColor(99, 102, 241);
      doc.rect(margin, yPosition, maxWidth, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`DIA ${index + 1}`, margin + 3, yPosition + 7);
      doc.setTextColor(0, 0, 0);
      yPosition += 15;

      // Lugares
      if (day.places && day.places.length > 0) {
        addText('LUGARES A VISITAR:', 11, true);
        
        day.places.forEach((place: any, placeIndex: number) => {
          checkNewPage(20);
          
          // Box de fundo
          doc.setFillColor(249, 250, 251);
          doc.rect(margin, yPosition, maxWidth, 2, 'F');
          yPosition += 4;
          
          // Horário e nome
          addText(`${placeIndex + 1}. ${place.start_time} - ${place.end_time} | ${place.name}`, 10, true);
          
          // Descrição
          if (place.description) {
            addText(`   ${place.description}`, 9, false);
          }
          
          // Preço
          if (place.entrance_fee) {
            addText(`   Entrada: ${place.entrance_fee}`, 9, false);
          }
          
          yPosition += 2;
        });
      }

      // Refeições
      if (day.meals && day.meals.length > 0) {
        checkNewPage(15);
        addText('REFEICOES:', 11, true);
        
        day.meals.forEach((meal: any) => {
          checkNewPage(12);
          
          const mealType = meal.type === 'breakfast' ? 'Pequeno-almoco' :
                          meal.type === 'lunch' ? 'Almoco' : 'Jantar';
          
          addText(`> ${mealType} (${meal.time}) - ${meal.restaurant}`, 10, true);
          if (meal.suggestion) {
            addText(`  ${meal.suggestion}`, 9, false);
          }
          if (meal.estimated_cost) {
            addText(`  Preco: ${meal.estimated_cost}`, 9, false);
          }
          yPosition += 1;
        });
      }

      yPosition += 5;
    });

    // Dicas gerais
    if (trip.general_tips && trip.general_tips.length > 0) {
      checkNewPage(30);
      
      doc.setFillColor(254, 243, 199);
      doc.rect(margin, yPosition, maxWidth, 8, 'F');
      yPosition += 6;
      addText('DICAS GERAIS', 12, true);
      
      trip.general_tips.forEach((tip: string, index: number) => {
        checkNewPage(10);
        addText(`${index + 1}. ${tip}`, 9, false);
      });
    }

    // Rodapé
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Página ${i} de ${totalPages} | Gerado em ${new Date().toLocaleDateString('pt-PT')}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Download
    const filename = sanitizeFilename(trip.region);
    doc.save(`roteiro-${filename}-${trip.duration_days}dias.pdf`);
    
    console.log('✅ Roteiro exportado para PDF');
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    alert('Erro ao exportar PDF. Tente novamente.');
  }
}
