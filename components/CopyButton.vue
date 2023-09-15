<template>
  <UButton
    :icon="icon"
    size="2xs"
    color="primary"
    square
    variant="ghost"
    class="align-middle"
    @click="onClick" />
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
const { text } = toRefs(props);

const copied = ref(false);

const icon = computed(() =>
  copied.value
    ? "i-heroicons-clipboard-document-check"
    : "i-heroicons-clipboard-document"
);

const onClick = () => {
  writeToClipBoard();

  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1000);
};

const writeToClipBoard = () => {
  navigator.clipboard.writeText(text.value);
};
</script>
