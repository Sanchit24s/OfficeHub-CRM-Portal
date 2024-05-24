import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Users } from '@core/services/interface';
import { environment } from '@env/environment';
import { ErrorDialogComponent } from 'app/routes/shared/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from 'app/routes/shared/success-dialog/success-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class ProfileOverviewComponent implements OnInit {
  loginUserId: string | null = null;
  user!: Users;
  isAdmin!: boolean;

  aboutForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(35)]],
    lastName: ['', [Validators.required, Validators.maxLength(35)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    gender: ['', [Validators.required]],
  });

  currentAddressForm = this.fb.group({
    currentAddress: ['', [Validators.required, Validators.maxLength(100)]],
    currentCity: ['', [Validators.required]],
    currentState: ['', [Validators.required]],
    currentCountry: ['', [Validators.required]],
    currentPinCode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]]
  });

  permanentAddressForm = this.fb.group({
    permanentAddress: ['', [Validators.required, Validators.maxLength(100)]],
    permanentCity: ['', [Validators.required]],
    permanentState: ['', [Validators.required]],
    permanentCountry: ['', [Validators.required]],
    permanentPinCode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]]
  });

  bioDataForm = this.fb.group({
    bloodGroup: ['', Validators.maxLength(5)],
    dateOfBirth: ['', Validators.required],
    age: ['', Validators.required],
    marriedStatus: ['', Validators.required],
    anniversaryDate: ['',],
    haveChildren: ['',],
    partnerName: ['',],
    childrenNames: ['', ],
    employeeId: [''],
    designation: [''],
    createdAt: [new Date(), Validators.required],
    workExperience: ['', Validators.maxLength(500)],
    educationalQualifications: ['', Validators.maxLength(500)],
    certifications: ['', Validators.maxLength(500)],
    skills: ['', Validators.maxLength(500)]
  });


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAdmin = localStorage.getItem('userRole') === 'ADMIN';

    const employeeFromState = this.router.getCurrentNavigation()?.extras.state?.employee;
    if (this.isAdmin && employeeFromState) {
      this.user = employeeFromState;
    } else {
      this.loginUserId = localStorage.getItem('userId');

      if (this.loginUserId) {
        this.getUser().subscribe(user => {
          this.user = user;
          this.setFormValues(user);
        });
      }

      this.bioDataForm.get('dateOfBirth')?.valueChanges.subscribe(() => {
        this.calculateAge();
      });

      if (this.bioDataForm.get('dateOfBirth')?.value) {
        this.calculateAge();
      }
    }

  }

  calculateAge(): void {
    const dobValue: string | null = this.bioDataForm.get('dateOfBirth')!.value;
    let dob: Date | null = null;

    if (dobValue) {
      dob = new Date(dobValue);
    }

    if (dob instanceof Date && !isNaN(dob.getTime())) {
      const ageDiff = Date.now() - dob.getTime();
      const ageDate = new Date(ageDiff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      this.bioDataForm.get('age')?.setValue(age.toString());
    } else {
      this.bioDataForm.get('age')?.setValue(null);
    }
  }


  getUser(): Observable<Users> {
    return this.http.get<Users>(`${environment.apiUrl}/user/${this.loginUserId}`);
  }

  updateUser(user: Users): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/user/update/${user._id}`, user);
  }

  setFormValues(user: Users): void {
    this.aboutForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
    });

    const hasCompleteCurrentAddress = user.currentAddress && user.currentCity &&
      user.currentState && user.currentCountry && user.currentPinCode;
    const hasCompletePermanentAddress = user.permanentAddress && user.permanentCity &&
      user.permanentState && user.permanentCountry && user.permanentPinCode;

    if (hasCompleteCurrentAddress) {
      this.currentAddressForm.patchValue({
        currentAddress: user.currentAddress,
        currentCity: user.currentCity,
        currentState: user.currentState,
        currentCountry: user.currentCountry,
        currentPinCode: user.currentPinCode,
      });
    }

    if (hasCompletePermanentAddress) {
      this.permanentAddressForm.patchValue({
        permanentAddress: user.permanentAddress,
        permanentCity: user.permanentCity,
        permanentState: user.permanentState,
        permanentCountry: user.permanentCountry,
        permanentPinCode: user.permanentPinCode,
      });
    }

    let dobValue: string | null;
    if (user.dateOfBirth instanceof Date) {
      dobValue = user.dateOfBirth.toISOString();
    } else if (typeof user.dateOfBirth === 'string') {
      dobValue = user.dateOfBirth;
    } else {
      dobValue = null;
    }

    let anniversaryDateValue: string | null;
    if (user.anniversaryDate instanceof Date) {
      anniversaryDateValue = user.anniversaryDate.toISOString();
    } else if (typeof user.anniversaryDate === 'string') {
      anniversaryDateValue = user.anniversaryDate;
    } else {
      anniversaryDateValue = null;
    }


    this.bioDataForm.patchValue({
      bloodGroup: user.bloodGroup,
      dateOfBirth: dobValue,
      age: user.age,
      marriedStatus: user.marriedStatus,
      anniversaryDate: anniversaryDateValue,
      haveChildren: user.haveChildren,
      partnerName: user.partnerName,
      childrenNames: user.childrenNames,
      employeeId: user.employeeId,
      createdAt: user.createdAt,
      designation: user.designation,
      workExperience: user.workExperience,
      educationalQualifications: user.educationalQualifications,
      certifications: user.certifications,
      skills: user.skills
    });
  }

  copyCurrentAddress(checked: boolean) {
    if (checked) {
      // Copy current address to permanent address fields
      const currentAddress = this.currentAddressForm.value;
      this.permanentAddressForm.patchValue({
        permanentAddress: currentAddress.currentAddress,
        permanentCity: currentAddress.currentCity,
        permanentState: currentAddress.currentState,
        permanentCountry: currentAddress.currentCountry,
        permanentPinCode: currentAddress.currentPinCode
      });
    } else {
      // Clear permanent address fields
      this.permanentAddressForm.reset();
    }
  }


  submit(formName: string) {
    let updatedFormValues: any;

    switch (formName) {
      case 'about':
        updatedFormValues = this.aboutForm.value;
        break;

      case 'currentAddress':
        updatedFormValues = this.currentAddressForm.value;
        break;

      case 'permanentAddress':
        updatedFormValues = this.permanentAddressForm.value;
        break;

      case 'bioData':
        updatedFormValues = this.bioDataForm.value;
        break;

      default:
        console.error('Invalid form name:', formName);
        return;
    }

    const updatedUser: Users = {
      ...this.user,
      ...updatedFormValues
    };

    this.updateUser(updatedUser).subscribe(
      () => {
        console.log('User updated successfully!');
        this.openSuccessDialog('Details updated successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        console.error('Error updating user:', error);
        this.openErrorDialog(error.message);
      }
    );
  }

  openSuccessDialog(message: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message },
      width: '700px',
      height: '450px'
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message },
      width: '700px',
      height: '450px'
    });
  }
}
