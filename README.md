# Angular Structure and Best Practices

Some should do and must do with angular.

- **.editorconfig** - This file helps you to create some configuration for your IDE. It must be same for everybody in the team to get better development experience.

- **tslint.json** - A must have extension for any project which is using Typescript. It will prompt the error or warning by underlining the code. It will help you with readability, maintainability, and functionality errors in your code. The configuration in this file also needs to be same for the team to get better development experience.

- **Use Path Mapping** - Typescript compiler allows to use path mapping so we can import our files like this:-\
  `import { MyComponent } from '@shared/components/mycomponent'`. \
  To config this all we need to do is to define the `paths` and `baseUrl` properties in the `compilerOptions` section in the `tsconfig.json` file.

```
// tsconfig.json

{
    "compilerOptions": {
    ...
    "baseUrl": "./src",
        "paths": {
            "@shared/*":["app/modules/shared/*"],
            "@core/*":["app/modules/core/*"]
        }
    ...
    }
}
```

- **Bundle your code into modules** - Modules help to organize your code into smaller bundles to make things easier. Angular gives us a root module called `AppModule`. But we can make our structure more cleaner and predicatable with the use of custom modules.

  - **Core Module** - The CoreModule is where we include application wide components and services. We import this module into AppModule and nowhere else.
    Components included statically on all your views, such as app-navigation, are ideal candidates for inclusion in the CoreModule.

  ```
  // core/core.module.ts

  import { NgModule } from ‘@angular/core’;
  import { CommonModule } from ‘@angular/common’;
  import { NavbarComponent } from ‘./navbar.component’;
  @NgModule({
    imports: [ CommonModule ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ],
    providers: []
  })
  export class CoreModule { }
  ```

  - **Shared Module** - The SharedModule contains components that will be reused in two or more feature modules. A TableLayoutComponent is just the kind of component that is likely to be reused in many parts of the application.

```
// shared/shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableLayoutComponent } from './table-layout.component';
@NgModule({
  imports: [ CommonModule ],
  declarations: [ TableLayoutComponent ],
  exports: [
      CommonModule,
      TableLayoutComponent
  ]
})
export class SharedModule { }
```

- **Feature Module** - The Angular docs describe feature modules as collections of related functionality that are imported into the root module.

> _Rule of thumb is to try to create features which don’t depend on any other features just on services provided by CoreModule and components provided by SharedModule._

```
// project-center/project-center.module.ts

import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProjectCenterComponent } from './project-center.component';
@NgModule({
  imports: [ SharedModule ],
  declarations: [ ProjectCenterComponent ],
  providers: [],
  exports: [ ProjectCenterComponent ]
})
export class ProjectCenterModule { }
```

> _Tip:- Core Module and Shared Module must have `CommonModule` imported in them._

- **Stateful & Stateless Components** - With growing application, we need to break our components in small parts wherever possible. Stateful and Stateless components help us to split our code in logical parts.

  - **Stateful Component** - It is also known as Container Component or Smart Component.

  > When something is “stateful”, it is a central point that stores information in memory about the app/component’s state. It also has the ability to change it. It is essentially a “living” thing that has knowledge of past, current and potential future state changes.

  - **Stateless Component** - It is also known as Presentational Component or Dumb Component.

  > When something is “stateless”, it calculates its internal state but it never directly mutates it. Given the same inputs, it will always produce the same output. These are not essentially “living” as they are merely passed information. This means it has no knowledge of the past, current or future state changes.

- **Eliminating the need to import interfaces** - In large applications, we have numerous interfaces and we import these numerous interfaces numerous times in numerous files. This process clutter our file with import statements. But we can use `namespace` to eliminate the needs to import interfaces files as well as group interfaces.

```
// This is how we do it normally.

// api.model.ts
export interface Customer {
  id: number;
  name: string;
}

export interface User {
  id: number;
  isActive: boolean;
}
-------------------------------------------------------------------------------------------------------------
// using the interfaces
import { Customer, User } from './api.model'; // this line will grow longer if there's more interfaces used

export class MyComponent {
  cust: Customer;
}
```

```
// Using namespace

// api.model.ts
namespace ApiModel {
  export interface Customer {
      id: number;
      name: string;
  }

  export interface User {
      id: number;
      isActive: boolean;
  }
}
------------------------------------------------------------------------------------------------
// using the interfaces
export class MyComponent {
  cust: ApiModel.Customer;
}
```

> _Tip:- We can also create any typescript file, which ends with `.d.ts` to eliminate the need to import. Here `d` stands for `declaration` or `definition`. But we should not create any declaration file because these files are usually use for external, 3rd party declarations._

```
// api.model.d.ts
// you don't need to export the interface in d file
interface Customer {
  id: number;
  name: string;
}
------------------------------------------------------------------------------------------
// using the interfaces of d file
export class MyComponent {
  cust: Customer;
}
```

- **Avoid logic in templates** - If you have any sort of logic in your templates, even if it is a simple `&&` clause, it is good to extract it out into its component.

> _Having logic in the template means that it is not possible to unit test it and therefore it is more prone to bugs when changing template code._

```
/* Before */

// template
<p *ngIf="role==='developer'"> Status: Developer </p>

// component
public ngOnInit (): void {
  this.role = 'developer';
}
---------------------------------------------------------------------------
/* After */

// template
<p *ngIf="showDeveloperStatus"> Status: Developer </p>

// component
public ngOnInit (): void {
    this.role = 'developer';
    this.showDeveloperStatus = true;
}
```

- **Make use of type unions and intersections** - This comes extremely in handy when dealing with data from a RESTful API.

```
// Here createdDate can either be string or Date. It helps a lot in debugging or unit testing.

interface User {
  fullname: string;
  age: number;
  createdDate: string | Date;
}
-----------------------------------------------------------------------------------------------
// You can even restrict the values that a field or a variable can have:-

interface Order {
  status: 'pending' | 'approved' | 'rejected';
}
```

- **Components should only deal with display logic** - Components are designed for presentational purposes and control what the view should do. Any business logic should be extracted into its own methods/services where appropriate, separating business logic from view logic and make the component deal only with the display logic.

- **Small reusable components** - Reusable components reduce duplication of code therefore making it easier to maintain and make changes. Dumb components are simpler, so they are less likely to have bugs.

> _Break a component until it can't be broken._

- **Avoid any unless it really is any** - When declaring variables or constants in Typescript without a typing, the typing of the variable/constant will be deduced by the value that gets assigned to it. This will cause unintended problems.

```
// Type inference is in play here:-

const x = 1;
const y = 'a';
const z = x + y;
console.log(`Value of z is: ${z}`

// Output
Value of z is 1a

-----------------------------------------------------
//Explicit typing

const x: number = 1;
const y: number = 'a';
const z: number = x + y;

// This will give a compile error saying:

Type '"a"' is not assignable to type 'number'.
const y:number
```

> _Tip:- Type inference refers to the automatic detection of the data type of an expression in a programming language._

- **trackBy** - When using ngFor to loop over an array in templates, use it with a trackBy function which will return an unique identifier for each item.

> When an array changes, Angular re-renders the whole DOM tree. But if you use trackBy, Angular will know which element has changed and will only make DOM changes for that particular element.

```
// Before

<li *ngFor="let item of items;">{{ item }}</li>
--------------------------------------------------------------------------------
// After

// in the template
<li *ngFor="let item of items; trackBy: trackByFn">{{ item }}</li>

// in the component
trackByFn(index, item) {
   return item.id; // unique id corresponding to the item
}
```

- **Lazy Loading** - It is a must feature to use in large scale application. Lazy loading helps us to improve the performance as well as structure of our application.

- **Use of `ng-container`** - The Angular `<ng-container>` is a grouping element that doesn't interfere with styles or layout because Angular doesn't put it in the DOM. It means `<ng-container>` does not generate any element in HTML.

```
// Validation error
<div class="has-error" *ngIf="username.errors && (username.dirty || username.touched)">
  <p *ngIf="username.errors.required">
    Username is required.
  </p>
</div>
------------------------------------------------------------------------------------------
// Validation error using <ng-container>
<ng-container *ngIf="username.errors && (username.dirty || username.touched)">
  <p class="has-error" *ngIf="username.errors['required']">
    Username is required.
  </p>
</ng-container>
```

- **Use SASS/SCSS** - Sass is a styles preprocessor which brings support for fancy things like variables (even though css will get variables soon too), functions, mixins and many more good things. Sass is also required to effectively use official **Angular Material Components** library with it’s extensive theming capabilities.

> _To use Sass we have to generate our project using Angular CLI `ng new` command with `--style scss` flag._

> _Tip:- If you are splitting your app into as small piece as possible, then create it's own `.component.scss/css` file, so that you can use this component as whole in other projects._

- **IE9/10/11** - When we generate a new project using angular cli, we get a file inside the `src` folder named `polyfills.ts`. It contains necessary imports and dependency in comment mode to support Internet explorer 9/10/11. So just uncomment the necessary import and install needed dependency and all the angular and es6 features will start to support.

- **SVG for IE** - If you are using svg (if not then you must) in your angular based or any other project, IE11 does not support SVG images by default. To use svg we can use a third party script, which can be found here:- https://github.com/Keyamoon/svgxuse
