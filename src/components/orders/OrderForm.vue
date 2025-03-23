<script setup>
import { ErrorMessage, Field, Form, validate } from "vee-validate";
import { useStore } from "vuex";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  formValues: Object,
  open: Boolean
});

const emit = defineEmits(['close-modal', 'update-orders'])

const store = useStore();
const modalRef = ref(null);
const shippingDate = ref(null);
const orderForm = ref(null);

const orderValidationSchema = {
  shippingOption: (value) => {
    if (value) {
      return true;
    }

    return "You must choose shipping option";
  },
  shippingDate: (value) => {
    if (value) {
      return true;
    }

    return "You must choose shipping date";
  },
  fullName: (value) => {
    if (value) {
      return true;
    }

    return "You must type your full name";
  },
  city: (value) => {
    if (value) {
      return true;
    }

    return "You must choose destination city";
  },
};

const closeModal = () => {
  if (modalRef.value) {
    modalRef.value.close();
    emit('close-modal');
  }
};

// open modal watch
watch(() => props?.open, (curr, prev) => {
  console.log(prev, curr)
  if(modalRef?.value) {
    if(curr == true) modalRef.value.showModal();
    else modalRef.value.close();
  }
});

// edit order watch
watch(() => props?.formValues, (curr, prev) => {
  console.log(curr)
  if(orderForm?.value) {
    if(curr != null) orderForm.value.setValues(curr.data)
    else orderForm.value.resetForm()
  }
  console.log("orderForm.value.getValues", orderForm.value.getValues())
});

const submitOrder = async (values) => {
  console.log("submitted form was submitted", values);

  const payload = {
    data: JSON.stringify(values)
  }

  if(props.formValues) payload.id = props.formValues?.id;

  if(props.formValues == null) {
    await store
      .dispatch("SAVE_ORDER", payload)
      .then((response) => {})
      .catch((error) => {
        window.console.log(error);
      })
      .finally(() => {});
  } else {
    await store
      .dispatch("UPDATE_ORDER", payload)
      .then((response) => {})
      .catch((error) => {
        window.console.log(error);
      })
      .finally(() => {});
    }

    emit("update-orders");
    closeModal();
  };

onMounted(() => {
  console.log("mounted")

  if (shippingDate.value)
  shippingDate.value.min = new Date().toLocaleDateString();
  
  console.log("props", props)

  if(props?.formValues) {
    console.log("formValues - ", formValues)
    validate(props.formValues).then((result) => {
      console.log("result",result)
    })
  }
})

watch
</script>

<template>
  <dialog ref="modalRef">
    <div
      id="default-modal"
      tabindex="-1"
      class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full place-items-center"
    >
      <div class="relative p-4 w-full max-w-2xl max-h-full">
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Shipping details
            </h3>
            <button
              @click="closeModal"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>

          <div class="p-4 md:p-5 space-y-4">
            <Form
              @submit="submitOrder"
              v-slot="{ values }"
              :validation-schema="orderValidationSchema"
              ref="orderForm"
              class="md:gap-6 items-start w-full p-5"
            >
              <div class="relative z-0 w-full mb-5">
                <Field
                  type="text"
                  name="fullName"
                  id="floating_first_name"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                />
                <label
                  for="floating_first_name"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Full name</label
                >
                <ErrorMessage class="text-sm text-red-800" name="fullName" />
              </div>

              <div class="flex md:gap-6">
                <div class="relative z-0 w-full mb-5">
                  <Field
                    name="city"
                    as="select"
                    id="city-options"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value=""></option>
                    <option value="Almaty">Almaty</option>
                    <option value="Astana">Astana</option>
                    <option value="Shymkent">Shymkent</option>
                    <option value="Kyzylorda">Kyzylorda</option>
                  </Field>
                  <label
                    for="city-options"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >City</label
                  >
                  <ErrorMessage class="text-sm text-red-800" name="city" />
                </div>

                <div class="relative z-0 w-full mb-5">
                  <Field
                    ref="shippingDate"
                    type="date"
                    min="16.03.2025"
                    name="shippingDate"
                    id="shipping-date"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  />
                  <label
                    for="shipping-date"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >Shipping Date</label
                  >
                  <ErrorMessage
                    class="text-sm text-red-800"
                    name="shippingDate"
                  />
                </div>
              </div>

              <div class="flex items-start mb-5">
                <div class="flex items-center h-5">
                  <Field
                    name="doorToDoor"
                    type="checkbox"
                    :value="true"
                    :unchecked-value="false"
                    class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  />

                </div>
                <label
                  for="door-to-door"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Door to door delivery
                </label>
                <ErrorMessage class="text-sm text-red-800" name="doorToDoor" />
              </div>

              <div class="items-start mb-5 md:gap-6">
                <h3 class="mb-3">Ship With:</h3>
                <div class="flex md:gap-6">
                  <div class="flex items-center mb-4">
                    <Field
                      id="shipping-option-1"
                      type="radio"
                      name="shippingOption"
                      value="train"
                      class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                      checked
                    />
                    <label
                      for="shipping-option-1"
                      class="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Train
                    </label>
                  </div>

                  <div class="flex items-center mb-4">
                    <Field
                      id="shipping-option-2"
                      type="radio"
                      name="shippingOption"
                      value="airplane"
                      class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      for="shipping-option-2"
                      class="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Airplane
                    </label>
                  </div>
                </div>

                <ErrorMessage
                  class="text-sm text-red-800"
                  name="shippingOption"
                />
              </div>
              <div
                class="flex justify-between items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
              >
                <button
                  @click="closeModal"
                  data-modal-hide="default-modal"
                  type="button"
                  class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
