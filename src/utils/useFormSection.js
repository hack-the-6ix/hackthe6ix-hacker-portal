import { getCurrentInstance, computed } from 'vue';

export default function useFormSection(props, initForm) {
  const { emit } = getCurrentInstance();

  if (!Object.keys(props.form).length) {
    emit('update:form', {...initForm});
  }

  return Object.keys(initForm).reduce((acc, field) => {
    acc[field] = computed({
      get: () => props.form[field],
      set: value => emit('update:form', {
        ...props.form,
        [field]: value,
      }),
    });
    return acc;
  }, {});
}