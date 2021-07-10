import { getCurrentInstance, computed } from 'vue';

export default function useFormSection(props, initForm) {
  const { emit } = getCurrentInstance();
  emit('update:form', { ...initForm, ...props.form });

  const fields = Object.keys(initForm).reduce((acc, field) => {
    acc[field] = computed({
      get: () => props.form[field],
      set: value => {
        emit('update:form', {
          ...props.form,
          [field]: value,
        });
        emit('update:errors', {
          ...props.errors,
          [field]: undefined,
        });
      },
    });
    return acc;
  }, {});

  return {
    ...fields,
    bindField: (name) => ({
      error: props.errors[name],
      name,
    }),
  };
}
