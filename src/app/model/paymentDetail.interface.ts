export interface PaymentDetail {
  id: number | undefined;
  payment: {
    id: number | undefined;
    description: string;
    manager: {
      id: number | undefined;
      firstName: string;
      lastName: string;
      documentType: string;
      documentNumber: string;
      address: string;
      ubigeoId: number | undefined;
      email: string;
      status: string;
    };
    dueDate: string;
    date: string;
    amount: string;
    status: string;
  };
  maleAttorney: {
    id: number | undefined;
    names: string;
    surnames: string;
    sex: string;
    birthDate: string;
    baptism: string;
    firstCommunion: string;
    confirmation: string;
    marriage: string;
    relationship: string;
    email: string;
    cellphone: string;
    address: string;
    documentType: string;
    documentNumber: string;
    status: string;
  };
  femaleAttorney: {
    id: number | undefined;
    names: string;
    surnames: string;
    sex: string;
    birthDate: string;
    baptism: string;
    firstCommunion: string;
    confirmation: string;
    marriage: string;
    relationship: string;
    email: string;
    cellphone: string;
    address: string;
    documentType: string;
    documentNumber: string;
    status: string;
  };
  student: {
    id: number | undefined;
    name: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    gender: string;
    birthDate: string;
    baptism: string;
    communion: string;
    email: string;
    birthPlace: string;
    level: string;
    grade: string;
    section: string;
    status: string;
  };
  amount: string;
  paymentType: string;
  date: string;
  status: string;
}
