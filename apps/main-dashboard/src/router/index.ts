import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/sports',
      name: 'sports',
      component: () => import('../views/SportsView.vue'),
      children: [
        {
          path: 'workouts',
          name: 'workouts',
          component: () => import('../views/sports/WorkoutsView.vue'),
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('../views/sports/CalendarView.vue'),
        },
        {
          path: 'results',
          name: 'results',
          component: () => import('../views/sports/ResultsView.vue'),
        },
      ],
    },
    {
      path: '/investments',
      name: 'investments',
      component: () => import('../views/InvestmentsView.vue'),
      children: [
        {
          path: 'portfolio',
          name: 'portfolio',
          component: () => import('../views/investments/PortfolioView.vue'),
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('../views/investments/TransactionsView.vue'),
        },
      ],
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
  ],
});

export default router;
