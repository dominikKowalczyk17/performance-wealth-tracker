<template>
  <div>
    <h1>Workouts</h1>
    <p>Track your workouts here.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { WorkoutCard } from '@/components/sports/WorkoutCard.vue';
import { useSportsStore } from '@/stores/sportsStore';
import { fetchWorkouts } from '@/api/sportsApi';
import { formatDate } from '@/utils/dateUtils';
import type { Workout } from '@/types/sportsTypes';
</script>
