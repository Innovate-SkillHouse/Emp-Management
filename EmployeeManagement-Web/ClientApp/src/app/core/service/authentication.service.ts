import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { map } from 'rxjs/operators';
import { LoginURLConstants, ProjectURLConstants, USERURLConstants } from "src/app/shared/constants/url-constant";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthModel } from "src/app/login/models/login.model";
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<AuthModel>;
    public currentUser: Observable<AuthModel>;
    constructor(private http: HttpClient, private router: Router) {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.currentUserSubject = new BehaviorSubject<AuthModel>(user);
        this.currentUser = this.currentUserSubject.asObservable();
    }
    login(username: string, password: string) {
        var loginmodel={
            userEmail:username,
            password:password
        }
        return this.http.post<any>(LoginURLConstants.LOGIN,loginmodel)
            .pipe(map(user => {
            debugger
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                //return user;
            }));
    }
    setUserContext(user: AuthModel) {
        this.currentUserSubject.next(user);
    }

    public get currentUserValue(): AuthModel {
        return this.currentUserSubject.value;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        //this.currentUserSubject.next(null);
        this.router.navigate(['/login'])
    }
    // getUserById(id: number): Observable<User> {
    //     return this.http.get<User>(UserURLConstants.GET_USER_BY_ID_URL, { params: { 'id': id } })
    // }

    // [HttpGet]
    //     [Route("GetUserById")]
    //     public async Task<UserModel> GetUserById(int id)
    //     {
    //         return await this._userBusiness.GetUserById(id);
    //     }
    getProjectDetails(){
        return this.http.get<any>(ProjectURLConstants.GETBYID).pipe(map(project=>{
            return project
        }))
    }
    SaveProject(projectname:string, projectdescription:string){
        var projectModel={
            ProjectId:0,
            ProjectName:projectname,
            ProjectDesc:projectdescription
        }
        return this.http.post<any>(ProjectURLConstants.SAVEPRG,projectModel).pipe(map(project=>{
            return project
        }))


    }
}