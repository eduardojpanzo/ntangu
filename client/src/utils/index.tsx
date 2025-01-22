export const buildInitials = (fullName: string) => {
  const first = fullName.split(" ").shift()?.charAt(0);
  const last = fullName.split(" ").pop()?.charAt(0);
  let sigla = " ";

  if (first && last) {
    sigla = first + last;
  }

  return sigla.toUpperCase();
};

interface DataStatus {
  valor: string;
  status: "orange" | "green" | "blue";
}

export function calcularDistanciaData(data: Date): DataStatus {
  const agora = new Date();
  const diferenca = Math.abs(agora.getTime() - data.getTime());
  const segundos = Math.floor(diferenca / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(dias / 30);
  const anos = Math.floor(dias / 365);

  let valor: string;
  let status: "orange" | "green" | "blue";

  if (anos > 0) {
    valor = `Em ${anos} ano${anos > 1 ? "s" : ""}`;
    status = "blue";
  } else if (meses > 0) {
    valor = `Em ${meses} mês${meses > 1 ? "es" : ""}`;
    status = "blue";
  } else if (semanas > 0) {
    valor = `Em ${semanas} semana${semanas > 1 ? "s" : ""}`;
    status = "blue";
  } else if (dias > 0) {
    if (dias === 1) {
      valor = "Amanhã";
    } else if (dias === 2) {
      valor = "Terça-feira";
    } else if (dias === 3) {
      valor = "Quarta-feira";
    } else if (dias === 4) {
      valor = "Quinta-feira";
    } else if (dias === 5) {
      valor = "Sexta-feira";
    } else if (dias === 6) {
      valor = "Sábado";
    } else if (dias === 7) {
      valor = "Domingo";
    } else {
      valor = `Em ${dias} dia${dias > 1 ? "s" : ""}`;
    }
    status = "green";
  } else if (horas > 0) {
    valor = `Em ${horas} hora${horas > 1 ? "s" : ""}`;
    status = "green";
  } else if (minutos > 0) {
    valor = `Em ${minutos} minuto${minutos > 1 ? "s" : ""}`;
    status = "green";
  } else if (segundos > 0) {
    valor = `Em ${segundos} segundo${segundos > 1 ? "s" : ""}`;
    status = "green";
  } else {
    valor = "Agora";
    status = "green";
  }

  if (data < agora) {
    valor = `Atrasado`;
    status = "orange";
  }

  return { valor, status };
}

export function convertTimeToReal(time: string): number {
  const partes = time.split(":").map(Number);
  let horas = 0;
  let minutos = 0;
  let segundos = 0;

  if (partes.length === 2) {
    horas = partes[0];
    minutos = partes[1];
  } else if (partes.length === 3) {
    horas = partes[0];
    minutos = partes[1];
    segundos = partes[2];
  }

  return Math.round((horas + minutos / 60 + segundos / 3600) * 100) / 100;
}

export function convertRealToTime(tempoReal: number): string {
  const horas = Math.floor(tempoReal);
  const minutos = Math.floor((tempoReal - horas) * 60);
  const segundos = Math.floor(((tempoReal - horas) * 3600) % 60);

  if (segundos > 0) {
    return `${horas.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
  } else {
    return `${horas.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}`;
  }
}

export function convertToDateInput(value: string) {
  const date = new Date(value);
  const formated = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  return formated;
}
