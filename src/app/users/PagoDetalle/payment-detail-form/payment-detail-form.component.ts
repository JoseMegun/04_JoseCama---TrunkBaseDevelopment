import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PaymentDetailService } from 'src/app/service/paymentDetail.service';
import { PaymentDetail } from 'src/app/model/paymentDetail.interface';
import { PaymentService } from 'src/app/service/payment.service';
import { Payment } from 'src/app/model/payment.interface';
import { ApoderadoService } from 'src/app/service/Apoderado.service';
import { IApoderado } from 'src/app/model/IApoderado';
import { StudentService } from 'src/app/service/student.service';
import { StudentModel } from 'src/app/model/student-model';

@Component({
  selector: 'app-payment-detail-form',
  templateUrl: './payment-detail-form.component.html',
  styleUrls: ['./payment-detail-form.component.css']
})
export class PaymentDetailFormComponent implements OnInit, AfterViewInit {
  newPaymentDetail: PaymentDetail = {
    id: undefined,
    payment: {
      id: undefined,
      description: '',
      manager: {
        id: undefined,
        firstName: '',
        lastName: '',
        documentType: '',
        documentNumber: '',
        address: '',
        ubigeoId: undefined,
        email: '',
        status: ''
      },
      dueDate: '',
      date: '',
      amount: '',
      status: ''
    },
    maleAttorney: {
      id: undefined,
      names: '',
      surnames: '',
      sex: '',
      birthDate: '',
      baptism: '',
      firstCommunion: '',
      confirmation: '',
      marriage: '',
      relationship: '',
      email: '',
      cellphone: '',
      address: '',
      documentType: '',
      documentNumber: '',
      status: ''
    },
    femaleAttorney: {
      id: undefined,
      names: '',
      surnames: '',
      sex: '',
      birthDate: '',
      baptism: '',
      firstCommunion: '',
      confirmation: '',
      marriage: '',
      relationship: '',
      email: '',
      cellphone: '',
      address: '',
      documentType: '',
      documentNumber: '',
      status: ''
    },
    student: {
      id: undefined,
      name: '',
      lastName: '',
      documentType: '',
      documentNumber: '',
      gender: '',
      birthDate: '',
      baptism: '',
      communion: '',
      email: '',
      birthPlace: '',
      level: '',
      grade: '',
      section: '',
      status: ''
    },
    amount: '',
    paymentType: '',
    date: '',
    status: 'A'
  };

  paymentId: number | undefined;
  maleAttorneyId: number | undefined;
  femaleAttorneyId: number | undefined;
  studentId: number | undefined;

  payments: Partial<Payment>[] = [];
  maleAttorneys: Partial<IApoderado>[] = [];
  femaleAttorneys: Partial<IApoderado>[] = [];
  students: Partial<StudentModel>[] = [];

  constructor(
    private paymentDetailService: PaymentDetailService,
    private paymentService: PaymentService,
    private apoderadoService: ApoderadoService,
    private studentService: StudentService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }

  loadData(): void {
    this.paymentService.getAllPayments().subscribe(
      (payments: Payment[]) => {
        this.payments = payments.filter(payment => payment.status === 'A');
      },
      (error: any) => {
        console.error('Error al obtener los pagos:', error);
      }
    );

    this.apoderadoService.listar().subscribe(
      (data: any) => { 
        console.log('Datos de Apoderados:', data); 
        const apoderados: IApoderado[] = data as IApoderado[]; 
        this.maleAttorneys = apoderados.filter(apoderado => apoderado.sex === 'M' && apoderado.status === 'A');
        this.femaleAttorneys = apoderados.filter(apoderado => apoderado.sex === 'F' && apoderado.status === 'A');
      },
      (error: any) => {
        console.error('Error al obtener los apoderados:', error);
      }
    );

    this.studentService.fetchActiveStudents().subscribe(
      (students: StudentModel[]) => {
        this.students = students.filter(student => student.status === 'A');
      },
      (error: any) => {
        console.error('Error al obtener los estudiantes:', error);
      }
    );
  }

  onSubmit(paymentDetailForm: NgForm) {
    if (paymentDetailForm.valid) {
      Swal.fire({
        title: '¿Estás seguro de agregar este detalle de pago?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar'
      }).then((result) => {
        if (result.isConfirmed) {
          const paymentDetailToSave: PaymentDetail = {
            ...this.newPaymentDetail,
            payment: { ...this.newPaymentDetail.payment, id: this.paymentId },
            maleAttorney: { ...this.newPaymentDetail.maleAttorney, id: this.maleAttorneyId },
            femaleAttorney: { ...this.newPaymentDetail.femaleAttorney, id: this.femaleAttorneyId },
            student: { ...this.newPaymentDetail.student, id: this.studentId },
            date: new Date().toISOString(),
            status: 'A'
          };

          this.paymentDetailService.createPaymentDetail(paymentDetailToSave).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Detalle de pago agregado exitosamente'
              });
              this.clearForm();
              this.router.navigate(['/paymentDetail']);
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al agregar el detalle de pago. Por favor, inténtelo de nuevo.'
              });
              console.error('Error al agregar el detalle de pago:', error);
            }
          );
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Formulario inválido. Verifique los campos.'
      });
      console.error('Formulario inválido. Verifique los campos.');
    }
  }

  onCancel() {
    this.router.navigate(['/paymentDetail']);
  }

  clearForm() {
    this.newPaymentDetail = {
      id: undefined,
      payment: {
        id: undefined,
        description: '',
        manager: {
          id: undefined,
          firstName: '',
          lastName: '',
          documentType: '',
          documentNumber: '',
          address: '',
          ubigeoId: undefined,
          email: '',
          status: ''
        },
        dueDate: '',
        date: '',
        amount: '',
        status: ''
      },
      maleAttorney: {
        id: undefined,
        names: '',
        surnames: '',
        sex: '',
        birthDate: '',
        baptism: '',
        firstCommunion: '',
        confirmation: '',
        marriage: '',
        relationship: '',
        email: '',
        cellphone: '',
        address: '',
        documentType: '',
        documentNumber: '',
        status: ''
      },
      femaleAttorney: {
        id: undefined,
        names: '',
        surnames: '',
        sex: '',
        birthDate: '',
        baptism: '',
        firstCommunion: '',
        confirmation: '',
        marriage: '',
        relationship: '',
        email: '',
        cellphone: '',
        address: '',
        documentType: '',
        documentNumber: '',
        status: ''
      },
      student: {
        id: undefined,
        name: '',
        lastName: '',
        documentType: '',
        documentNumber: '',
        gender: '',
        birthDate: '',
        baptism: '',
        communion: '',
        email: '',
        birthPlace: '',
        level: '',
        grade: '',
        section: '',
        status: ''
      },
      amount: '',
      paymentType: '',
      date: '',
      status: 'A'
    };

    this.paymentId = undefined;
    this.maleAttorneyId = undefined;
    this.femaleAttorneyId = undefined;
    this.studentId = undefined;
  }

  private initializeSidebar(): void {
    const allDropdown = document.querySelectorAll<HTMLElement>('#sidebar .side-dropdown');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.querySelector<HTMLElement>('nav .toggle-sidebar');
    const allSideDivider = document.querySelectorAll<HTMLElement>('#sidebar .divider');

    if (!allDropdown || !sidebar || !toggleSidebar || !allSideDivider) {
      console.error('Elementos no encontrados');
      return;
    }

    allDropdown.forEach(item => {
      const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
      if (!a) return;
      this.renderer.listen(a, 'click', (e) => {
        e.preventDefault();

        if (!a.classList.contains('active')) {
          allDropdown.forEach(i => {
            const aLink = i.parentElement?.querySelector<HTMLElement>('a:first-child');
            if (aLink) {
              aLink.classList.remove('active');
              i.classList.remove('show');
            }
          });
        }

        a.classList.toggle('active');
        item.classList.toggle('show');
      });
    });

    if (sidebar.classList.contains('hide')) {
      allSideDivider.forEach(item => {
        item.textContent = '-';
      });
      allDropdown.forEach(item => {
        const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
        if (a) {
          a.classList.remove('active');
          item.classList.remove('show');
        }
      });
    } else {
      allSideDivider.forEach(item => {
        item.textContent = item.getAttribute('data-text');
      });
    }

    this.renderer.listen(toggleSidebar, 'click', () => {
      sidebar.classList.toggle('hide');

      if (sidebar.classList.contains('hide')) {
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });

        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
      } else {
        allSideDivider.forEach(item => {
          item.textContent = item.getAttribute('data-text');
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseleave', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseenter', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
        allSideDivider.forEach(item => {
          item.textContent = item.getAttribute('data-text');
        });
      }
    });
  }

  private initializeMenu(): void {
    const allMenu = document.querySelectorAll<HTMLElement>('main .content-data .head .menu');

    allMenu.forEach(item => {
      const icon = item.querySelector<HTMLElement>('.icon');
      const menuLink = item.querySelector<HTMLElement>('.menu-link');
      if (!icon || !menuLink) return;

      this.renderer.listen(icon, 'click', () => {
        menuLink.classList.toggle('show');
      });

      this.renderer.listen(window, 'click', (e: Event) => {
        if (e.target !== icon && e.target !== menuLink && menuLink.classList.contains('show')) {
          menuLink.classList.remove('show');
        }
      });
    });
  }

  private initializeProgressBar(): void {
    const allProgress = document.querySelectorAll<HTMLElement>('main .card .progress');

    allProgress.forEach(item => {
      const value = item.getAttribute('data-value');
      if (value) {
        (item as HTMLElement).style.setProperty('--value', value);
      }
    });
  }
}
