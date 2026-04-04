<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16">

    <!-- ONE ID / ONE NATIONAL RANKING banner -->
    <div class="w-full max-w-3xl mb-10">
      <div class="bg-brand-darker px-8 py-4 text-center">
        <span class="text-4xl sm:text-5xl font-black tracking-widest text-brand-yellow uppercase">ONE ID.</span>
      </div>
      <div class="bg-brand-mid px-8 py-3 text-center">
        <span class="text-xl sm:text-2xl font-black tracking-widest text-brand-yellow/90 uppercase">One National Ranking</span>
      </div>
    </div>

    <!-- Description -->
    <div class="w-full max-w-2xl text-center mb-12 space-y-3">
      <p class="text-base sm:text-lg font-bold uppercase tracking-wide text-brand-yellow leading-relaxed">
        Register for your Philippine Pickleball Participant Registry
        <span class="text-brand-red">(PPPR) ID</span> —
      </p>
      <p class="text-sm sm:text-base text-brand-yellow/70 uppercase tracking-wide leading-relaxed">
        The only official way to be included in the National Ranking System and National Pool.
      </p>
    </div>

    <!-- Sign Up CTA -->
    <a
      href="https://registry.pickleball.ph/"
      target="_blank"
      rel="noopener"
      class="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-red hover:bg-brand-red/90 transition-all duration-200 shadow-xl shadow-brand-red/30 hover:shadow-brand-red/50 hover:scale-105 active:scale-100"
    >
      <span class="text-xl sm:text-2xl font-black uppercase tracking-widest text-brand-yellow">
        Sign Up Here for your PPPR ID
      </span>
      <svg class="w-6 h-6 text-brand-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>

    <p class="mt-5 text-xs text-brand-yellow/30 uppercase tracking-widest">registry.pickleball.ph</p>

  </div>
</template>
