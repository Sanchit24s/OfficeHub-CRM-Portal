import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { LoginService } from './login.service';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>({});
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  private loggedInUserEmailSubject: BehaviorSubject<string | null> = 
        new BehaviorSubject<string | null>(null);
  loggedInUserEmail$: Observable<string | null> = this.loggedInUserEmailSubject.asObservable();

  private loggedInUserIdSubject: BehaviorSubject<string | null> = 
        new BehaviorSubject<string | null>(null);
  loggedInUserId$: Observable<string | null> = this.loggedInUserIdSubject.asObservable();

  private loggedInUserRoleSubject: BehaviorSubject<string | null> = 
        new BehaviorSubject<string | null>(null);
  loggedInUserRole$: Observable<string | null> = this.loggedInUserRoleSubject.asObservable();

  private loginEventSource = new Subject<void>();
  loginEvent = this.loginEventSource.asObservable();

  constructor(
              private loginService: LoginService, 
              private tokenService: TokenService
  ) {
    const userEmail = this.getUserEmailFromAuthMechanism();
    if (userEmail) {
      this.setLoggedInUserEmail(userEmail);
    }

    const userId = this.getUserIdFromAuthMechanism();
    if (userId) {
      this.setLoggedInUserId(userId);
    }

    const userRole = this.getUserRoleFromAuthMechanism();
    if (userRole) {
      this.setLoggedInUserRole(userRole);
    }
  }

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token => this.tokenService.set(token)),
      map(() => this.check())
    );
  }

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  // logout() {
  //   return this.loginService.logout().pipe(
  //     tap(() => this.tokenService.clear()),
  //     map(() => !this.check())
  //   );
  // }

  logout():Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    return of(null);
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.me().pipe(tap(user => this.user$.next(user)));
  }

  onLogin() {
    this.loginEventSource.next();
  }

  // Get user email
  getLoggedInUserEmail(): Observable<string | null> {
    return this.loggedInUserEmail$;
  }

  setLoggedInUserEmail(email: string): void {
    this.loggedInUserEmailSubject.next(email);
  }

  removeLoggedInUserEmail(): void {
    this.loggedInUserEmailSubject.next(null);
  }

  private getUserEmailFromAuthMechanism(): string | null {
    // Get the JWT token from wherever it's stored (e.g., localStorage, cookie)
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
      try {
        // Decode the JWT token and extract the user's email from the payload
        const decodedToken: any = jwtDecode(jwtToken);
        const userEmail = decodedToken.email;

        //console.log(userEmail);

        if (userEmail) {
          return userEmail;
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }

    return null; // Return null if the JWT token is not available or the user's email is not present
  }


  // Get user id
  getLoggedInUserId(): Observable<string | null> {
    return this.loggedInUserId$;
  }

  setLoggedInUserId(id: string): void {
    this.loggedInUserIdSubject.next(id);
  }

  removeLoggedInUserId(): void {
    this.loggedInUserIdSubject.next(null);
  }

  private getUserIdFromAuthMechanism(): string | null {
    // Get the JWT token from wherever it's stored (e.g., localStorage, cookie)
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
      try {
        // Decode the JWT token and extract the user's email from the payload
        const decodedToken: any = jwtDecode(jwtToken);
        const userId = decodedToken._id;

        //console.log(userEmail);

        if (userId) {
          return userId;
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }

    return null; // Return null if the JWT token is not available or the user's email is not present
  }


  // user role
  getLoggedInUserRole(): Observable<string | null> {
    return this.loggedInUserRole$;
  }

  setLoggedInUserRole(role: string): void {
    this.loggedInUserRoleSubject.next(role);
  }

  removeLoggedInUserRole(): void {
    this.loggedInUserRoleSubject.next(null);
  }

  private getUserRoleFromAuthMechanism(): string | null {
    // Get the JWT token from wherever it's stored (e.g., localStorage, cookie)
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
      try {
        // Decode the JWT token and extract the user's role from the payload
        const decodedToken: any = jwtDecode(jwtToken);
        const userRole = decodedToken.role;

        if (userRole) {
          return userRole;
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }

    return null; // Return null if the JWT token is not available or the user's email is not present
  }

}


  
