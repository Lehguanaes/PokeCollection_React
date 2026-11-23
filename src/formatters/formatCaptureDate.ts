/*
 * Este utilitário formata o instante registrado em uma captura.
 * Ele é consumido nas telas que exibem o histórico do treinador.
 * Ele converte datas persistidas para o padrão brasileiro de data e hora.
 */
// Converte o instante ISO persistido na coleção para a convenção brasileira de
// data e hora. A formatação fica centralizada para todas as telas apresentarem o
// mesmo padrão, enquanto `Intl` respeita regras locais de ordem e pontuação.
export function formatCaptureDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
