<template>
    <div class="flex items-start gap-4 text-love">
        <!-- Avatar -->
        <div class="h-10 w-10 bg-slate-100 rounded-full">
            <img class="w-full h-full rounded-full"v-lazy="'https://picsum.photos/80/80?random=' + dataFeedHeader" />
        </div>

        <!-- Name -->
        <div class="flex flex-col gap-1 justify-center w-10/12">
            <div class="flex gap-1">
                <span class="text-base leading-4 text-zinc-800 font-extrabold">Jean Marker,</span>
                <span class="text-base leading-4 font-medium text-zinc-800 opacity-80">@lyfanexus</span>
            </div>
            <!-- Name -->
            <!-- <span class="text-sm"> Suspendu &#8226; 16h </span>  -->
            <span class="flex text-desc font-love text-zinc-800 ">
                {{
                    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit est voluptatem in repudiandae
                quisquam sint molestiae illo consequuntur, nesciunt explicabo, ullam dolore ea.Reiciendis et, minus
                sunt quam, sed voluptatum maiores velit rem minima, commodi repellat animi magni sequi reprehenderit
                numquam.`.slice(0, 100)
                }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps(['dataFeedHeader'])
</script>
