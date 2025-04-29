import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
      // estamos salvando a rota q ele tentou acessar antes de envia-lo
      // pra rota de login.
      // ficará tipo assim: /login?returnUrl=/home
      // se for a rota home q ele tentou acessar, apos o login, ele voltara
      // direto pra rota q ele queria.
    });
  }
  // basicamente o que acontece aqui é: se o usuario estiver logado
  // (tiver um authToken no localStorage), o AuthGuard será true, ou seja,
  // a pessoa poderá acessar a rota. se nao, ele vai criar uma url tree,
  // ou seja, ao tentar acessar uma rota protegida, o angular vai envia-lo para
  // rota de login
};
