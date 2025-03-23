<script setup>
  import { ErrorMessage, Field, Form } from "vee-validate";
  import { useStore } from "vuex";
  import { ref, onMounted } from "vue";
import IconButton from "../components/ui/IconButton.vue";
import OrderForm from "../components/orders/OrderForm.vue";
import ConfirmModal from "../components/ui/ConfirmModal.vue";

  const store = useStore();
  const ordersData = ref([]);
  const ordersSearchResults = ref([]);

  const ordersModalRef = ref(null);
  const confirmDeleteDialog = ref(null);
  const orderToDeleteId = ref(null);

  let ordersModalOpen = ref(false);
  let orderFormData = ref(null);
  const orderSearchValues = ref({
    search: false,
    fullName: "",
    startDate: "",
    endDate: ""
  });

  const clearSearchValues = () => {
    ordersSearchResults.value = [];
    orderSearchValues.value = {
      search: false,
      fullName: "",
      startDate: "",
      endDate: ""
    }
  }

  const checkEmptySearchObj = () => {
    if(orderSearchValues.value) {
      const values = Object.entries(orderSearchValues.value).filter(x => x[0] != "search");
      values.ever
      if(values.every(x => x[1] == "" || x[1] == false || x[1] == undefined || x[1] == null)) return true;
      return false;
    }
  }

  const searchOrders = () => {
    const check = checkEmptySearchObj();

    if(check) {
      console.log("clear");
      clearSearchValues();
      return;
    }

    const fullName = orderSearchValues.value.fullName.toLowerCase();
    const startDate = orderSearchValues.value.startDate;
    const endDate = orderSearchValues.value.endDate;
    let searchArr = JSON.parse(JSON.stringify(ordersData.value));

    console.log("fullname", fullName, "startDate", startDate, "endDate", endDate);

    if(fullName) {
      console.log(searchArr, "search arr fulname")
      searchArr = searchArr.filter(x => x.data.fullName.toLowerCase().includes(fullName));
    }

    if(startDate && endDate) {
      searchArr = searchArr.filter(x => x.data?.shippingDate >= startDate && x.data?.shippingDate <= endDate);
    } else if(startDate) {
      console.log("only start", startDate)
      searchArr = searchArr.filter(x => x.data?.shippingDate >= startDate);
    } else if(endDate) {
      searchArr = searchArr.filter(x => x.data?.shippingDate <= endDate);
    }
    console.log("searchArr",searchArr)
    ordersSearchResults.value = searchArr;
    orderSearchValues.value.search = true;
  }

  const updateOrders = () => {
    if(ordersData.value) {
      ordersData.value = [];

      getOrders();
    }
  }

  const editOrder = (order) => {
    // if(ordersModalRef.value) {
      ordersModalOpen.value = true;
      console.log("order", order);
      orderFormData.value = order
    // }
  }

  const openOrderModal = () => {
    ordersModalOpen.value = true;
    orderFormData.value = null;
  }

  const closeOrderModal = () => {
    ordersModalOpen.value = false;
    orderFormData.value = null;
  }

  const confirmDeleteOrder = () => {
    console.log("confirmation window", confirmDeleteDialog.value);
    if(confirmDeleteDialog.value) {
      confirmDeleteDialog.value.openDialog();
    }
  }

  const deleteOrder = async () => {
    console.log("Click", orderToDeleteId)

    await store
      .dispatch("DELETE_ORDER", orderToDeleteId?.value)
      .then((response) => {})
      .catch((error) => {
        window.console.log(error);
      })
      .finally(() => {});

      updateOrders();
  }

  const getOrders = async () => {
    const orders = await store
      .dispatch("GET_ORDERS")
      .then((response) => {
        return response
      })
      .catch((error) => {
        window.console.log(error);
      })
      .finally(() => {});
      console.log(orders);

      ordersData.value = orders.map(order => ({ id: order.id, data: JSON.parse(order.data)}));
  }  

  onMounted(() => {
    console.log("onMounted")
    getOrders();
  })
</script>

<template>
  
<div class="relative overflow-x-auto">
  <button
    @click="openOrderModal"
    class="block text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 dark:bg-blue-600 dark:hover:bg-blue-700"
    type="button"
  >
    Add new order
  </button>
  <OrderForm :formValues="orderFormData" :open="ordersModalOpen" @close-modal="closeOrderModal" @update-orders="updateOrders"/>


  <div class="mb-6 max-w-full flex md:gap-6 items-start">   
    <div class="relative w-full">
      <label for="search-fullname" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input 
          type="search" 
          v-model="orderSearchValues.fullName"
          @update:model-value="searchOrders"
          id="search-fullname" 
          class="block w-full p-4 ps-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="Search by Full Name" 
          />
    </div>
    <div class="relative flex w-full md:gap-6 sm:gap-3 xs:gap-2">
      <div class="relative z-0 w-full">
          <input
            id="start-shipping-date"
            type="date"
            v-model="orderSearchValues.startDate"
            @update:model-value="searchOrders"
            class="block w-full p-4 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <label
            for="start-shipping-date"
            class="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Start Date</label
          >
        </div>
        <div class="relative z-0 w-full">
              <input
                v-model="orderSearchValues.endDate"
                @update:model-value="searchOrders"
                id="end-shipping-date"
                type="date"
                class="block w-full p-4 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <label
                for="end-shipping-date"
                class="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >End Date</label
              >
        </div>
        <div class="flex items-center" @click="clearSearchValues">
          <IconButton :disabled="checkEmptySearchObj()" icon="close"/>
        </div>
    </div>
  </div>


    <table class="py-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Id
                </th>
                <th scope="col" class="px-6 py-3">
                    Full Name
                </th>
                <th scope="col" class="px-6 py-3">
                    City
                </th>
                <th scope="col" class="px-6 py-3">
                    Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Shipping option
                </th>
                <th scope="col" class="px-6 py-3">
                    Door to Door
                </th>
                <th scope="col" class="px-6 py-3">
                  
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orderSearchValues.search ? ordersSearchResults : ordersData" :key="order.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ order.id }}
                </th>
                <td class="px-6 py-4">
                  {{ order.data.fullName }}
                </td>
                <td class="px-6 py-4">
                  {{ order.data.city }}
                </td>
                <td class="px-6 py-4">
                  {{ order.data.shippingDate }}
                </td>
                <td class="px-6 py-4 capitalize">
                  {{ order.data.shippingOption }}
                </td>
                <td class="px-6 py-4">
                  {{ order.data.doorToDoor ? "Yes" : "No" }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex ">
                    <div @click="editOrder(order)">
                      <IconButton icon="edit" :loading="false" />
                    </div>
                    <div @click="confirmDeleteOrder(); orderToDeleteId = order.id">
                      <IconButton icon="delete"/>
                    </div>
                  </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<ConfirmModal ref="confirmDeleteDialog" headerText="Are you sure you want to delete this order?" :confirmCallback="deleteOrder"/>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
