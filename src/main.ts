import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";

import { Buyer } from "./components/Models/Buyer";
import { Cart } from "./components/Models/Cart";
import { Catalog } from "./components/Models/Catalog";

import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { API_URL } from "./utils/constants";

import { PageView } from "./components/View/PageView";
import { ModalView } from "./components/View/ModalView";
import { HeaderView } from "./components/View/HeaderView";
import { CartView } from "./components/View/CartView";
import { OrderSuccessView } from "./components/View/OrderSuccessView";

import { IOrderResultApi, IProduct, TPayment } from "./types";

import { cloneTemplate, ensureElement } from "./utils/utils";

import { CatalogCard } from "./components/View/CatalogCard";
import { PreviewCard } from "./components/View/PreviewCard";
import { CartCard } from "./components/View/CartCard";

import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";



const events = new EventEmitter();
const catalogModel = new Catalog(events);
const apiModel = new Api(API_URL);
const larekApiModel = new LarekApi(apiModel);
const pageView = new PageView(ensureElement(".gallery"));
const modal = new ModalView(ensureElement("#modal-container"), events);
const cartModel = new Cart(events);
const headerView = new HeaderView(ensureElement(".header"), events);
const cart = new CartView(cloneTemplate("#basket"), events);
const buyerModel = new Buyer(events);
const currentOrderForm = new OrderForm(cloneTemplate("#order"), events);
const currentContactsForm = new ContactsForm(cloneTemplate("#contacts"), events);

//Загрузка данных с сервера

larekApiModel
  .getProducts()
  .then((result: IOrderResultApi) => {
    console.log("Товары получены с сервера");
    catalogModel.saveProducts(result.items);
  })
  .catch((error) => {
    console.error("Ошибка", error);
  });

//Рендер каталога

events.on("card-catalog:changed", () => {
  const items = catalogModel.getProducts().map((item) => {
    const cardCatalog = new CatalogCard(cloneTemplate("#card-catalog"), {
      onClick: () => events.emit("card:selected", item),
    });
    return cardCatalog.render(item);
  });
  pageView.render({ catalog: items });
});

//Превью товара

events.on("card:selected", (item: IProduct) => {
  catalogModel.saveProduct(item); 
});


events.on("product:selected", (item: IProduct) => {
  const isInCart = cartModel.checkProduct(item.id);
  const previewCard = new PreviewCard(cloneTemplate("#card-preview"), {
    onButtonClick: () => {
      if (isInCart) {
        cartModel.deleteProduct(item.id);
      } else if (item.price !== null) {
        cartModel.addProduct(item);
      }
      modal.close();
    },
  });
  modal.content = previewCard.render({
    title: item.title,
    price: item.price,
    image: item.image,
    category: item.category,
    description: item.description,
  });
  previewCard.setCanAddToBusket(isInCart, item.price);
  modal.open();
});

//Обновление корзины и счетчика

events.on("shopping-cart:changed", () => {
  headerView.counter = cartModel.getProductsAmount();
  const shoppingCartItems = cartModel.getSelectedProducts()
    .map((item, index) => {
      const cartCard = new CartCard(cloneTemplate("#card-basket"), events);
      return cartCard.render({
        id: item.id,
        title: item.title,
        price: item.price,
        index: index + 1,
      });
    });
  cart.items = shoppingCartItems;
  cart.price = cartModel.getTotal() || 0;
  const isEmpty = cartModel.getProductsAmount() === 0;
  cart.setCanBuy(isEmpty);
});

//Открытие корзины

events.on("shopping-cart:open", () => {
  const isEmpty = cartModel.getProductsAmount() === 0;
  cart.setCanBuy(isEmpty);
  modal.content = cart.render();
  modal.open();
});

// Удаление товара из корзины 

events.on("shopping-cart:remove", (data: { id: string }) => {
  cartModel.deleteProduct(data.id);
});

//Заказ и покупатель

events.on("order:changed", (data: { field: string; value: string }) => {
  if (data.field === "payment") {
    buyerModel.savePaymentType(data.value as TPayment);
  } else if (data.field === "address") {
    buyerModel.saveAddress(data.value);
  }
});

events.on("contacts:changed", (data: { field: string; value: string }) => {
  if (data.field === "email") {
    buyerModel.saveEmail(data.value);
  } else if (data.field === "phone") {
    buyerModel.savePhone(data.value);
  }
});

//Валидация и обновление форм

events.on("buyer-data:changed", (data: { field: string }) => {
  const validation = buyerModel.validate();
  const buyerData = buyerModel.getData();

  //Форма заказа

  if (data.field === "payment" || data.field === "address" || data.field === "all") {
    if (currentOrderForm) {
      currentOrderForm.payment = buyerData.payment;
      currentOrderForm.address = buyerData.address;
      const paymentValid = !validation.payment && !validation.address;
      currentOrderForm.valid = paymentValid;
      const orderErrors = [validation.payment, validation.address].filter(Boolean);
      currentOrderForm.errors = orderErrors;
    }
  }

//Форма контактов

  if (data.field === "email" || data.field === "phone" || data.field === "all") {
    if (currentContactsForm) {
      currentContactsForm.email = buyerData.email;
      currentContactsForm.phone = buyerData.phone;
      const contactsValid = !validation.email && !validation.phone;
      currentContactsForm.valid = contactsValid;
      const contactsErrors = [validation.email, validation.phone].filter(Boolean);
      currentContactsForm.errors = contactsErrors;
    }
  }
});

//Переход к форме заказа

events.on("order:open", () => {
  modal.content = currentOrderForm.render();
  events.emit("buyer-data:changed", { field: "all" });
});

//Переход к форме контактов

events.on("order:submit", () => {
  modal.content = currentContactsForm.render();
  events.emit("buyer-data:changed", { field: "all" });
});

//Отправка заказа

events.on("contacts:submit", () => {
  const orderData = {
    ...buyerModel.getData(),
    items: cartModel.getSelectedProducts().map((item) => item.id),
    total: cartModel.getTotal(),
  };

  larekApiModel.postOrder(orderData)
    .then(() => {
      const success = new OrderSuccessView(cloneTemplate("#success"), {
        onClick: () => {
          modal.close();
        },
      });
      success.total = cartModel.getTotal();
      modal.content = success.render();

      buyerModel.clearBuyerData();
      cartModel.clearCart();
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
});