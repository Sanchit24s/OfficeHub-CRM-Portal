import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from '@core/services/interface';
import { UserService } from '@core/services/user.service';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  loginUserId: string | null = null;
  user!: Users;


  aboutForm = this.fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    phone: [''],
    gender: [''],
  });

  currentAddressForm = this.fb.group({
    currentAddress: [''],
    currentCity: [''],
    currentState: [''],
    currentCountry: [''],
    currentPinCode: ['']
  });

  permanentAddressForm = this.fb.group({
    permanentAddress: [''],
    permanentCity: [''],
    permanentState: [''],
    permanentCountry: [''],
    permanentPinCode: ['']
  });

  bioDataForm = this.fb.group({
    bloodGroup: [''],
    dateOfBirth: [''],
    age: [''],
    marriedStatus: [''],
    anniversaryDate: [''],
    haveChildren: [''],
    partnerName: [''],
    childrenNames: [''],
    employeeId: [''],
    designation: [''],
    createdAt: [new Date(), Validators.required],
    workExperience: [''],
    educationalQualifications: [''],
    certifications: [''],
    skills: ['']
  });


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const employeeId = params.id;

      this.http.post<any>(`${environment.apiUrl}/user/empId`, { employeeId }).subscribe(
        (Id) => {
          this.userService.getUser(Id).subscribe(
            (data) => {
              this.user = data;
              this.setFormValues(this.user);
            },
            (error) => {
              this.router.navigate(['/404']);
              console.log('Error fetching values', error);
            }
          );
        },
        (error) => {
          this.router.navigate(['/404']);
          console.log('Error fetching values', error);
        }
      );
    });
  }

  setFormValues(user: Users): void {
    if(user !== null || user !== undefined || user !== '') {
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
  }
}
