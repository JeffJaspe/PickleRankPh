<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] gap-6 select-none">
    <div class="logo-enter flex items-end gap-3">
      <span class="text-5xl sm:text-7xl font-black tracking-widest uppercase text-white leading-none">
        Pickle<span class="text-[#ff4655]">Rank</span>
      </span>
      <span class="text-base sm:text-xl font-black tracking-widest text-white/20 uppercase pb-1">PH</span>
    </div>
    <div class="bar-enter w-24 h-0.5 bg-[#ff4655]"></div>
    <p class="text-enter text-xs font-bold tracking-[0.4em] uppercase text-white/30">Coming Soon</p>
  </div>
</template>

<style scoped>
.logo-enter {
  animation: fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.bar-enter {
  animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}
.text-enter {
  animation: fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scaleX(0); }
  to   { opacity: 1; transform: scaleX(1); }
}
</style>
