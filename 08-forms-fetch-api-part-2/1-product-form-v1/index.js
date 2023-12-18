import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  constructor(productId) {
    this.productId = productId;

    this.productsUrl = new URL('api/rest/products', BACKEND_URL);
    this.productsUrl.searchParams.set('id', this.productId);

    this.categoryUrl = new URL('api/rest/categories', BACKEND_URL);
    this.categoryUrl.searchParams.set('_sort', 'weight');
    this.categoryUrl.searchParams.set('_refs', 'subcategory');

    this.element = this.createElement(this.createFormTemplate());
    this.subElements = {
      productForm: this.element.querySelector('#productForm'),
      title: this.element.querySelector(`#title`),
      description: this.element.querySelector(`#description`),
      imageListContainer: this.element.querySelector('#imageListContainer'),
      subcategory: this.element.querySelector(`#subcategory`),
      price: this.element.querySelector(`#price`),
      discount: this.element.querySelector(`#discount`),
      quantity: this.element.querySelector(`#quantity`),
      status: this.element.querySelector(`#status`),
    };

    this.addSubmitFormListener();
    this.addUploadImgListener();
    this.addRemoveImgListener();
  }

  createFormTemplate = () => {
    return `
    <div class="product-form">
    <form data-element="productForm" id="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" id="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" id="description" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer" id="imageListContainer"><ul class="sortable-list"></ul></div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" id="subcategory" name="subcategory"></select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" id="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" id="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" id="quantity" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" id="status" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
    `;
  }

  createImageTemplate = (data) => {
    return `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${escapeHtml(data.url)}">
        <input type="hidden" name="source" value="${escapeHtml(data.source)}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(data.url)}">
          <span>${escapeHtml(data.source)}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `;
  }

  createSelectOptionTemplate = (id, name) => {
    return `
      <option value="${id}">${escapeHtml(name)}</option>
    `;
  }

  createCategoriesListElement = (data) => {
    if (data) {
      data.forEach(item => {
        let firstName = item.title;
        item.subcategories.forEach(subItem => {
          this.subElements.subcategory.append(this.createElement(this.createSelectOptionTemplate(subItem.id, firstName + ' > ' + subItem.title)))
        });
      });
    };
  }

  createImageListElement = (data) => {
    if (data) {
      data.forEach(item => {
        this.subElements.imageListContainer.firstElementChild.append(this.createElement(this.createImageTemplate(item)));
      });
    }
  }

  createElement = (template) => {
    const container = document.createElement('div');
    container.innerHTML = template;
    return container.firstElementChild;
  }

  getData = async (url) => {
    return await fetchJson(url);
  }

  renderCategories = async () => {
    const categories = await this.getData(this.categoryUrl);
    this.createCategoriesListElement(categories);
  }

  renderProductData = async () => {
    const data = await this.getData(this.productsUrl);
    Object.keys(this.subElements).forEach(key => {
      if (key != 'imageListContainer' && key != 'productForm') {
        this.subElements[key].value = data[0][key];
      } else if (key == 'imageListContainer') {
        this.createImageListElement(data[0]['images']);
      }
    });
  }

  async render() {
    await this.renderCategories();

    if (!this.productId) {
      return this.element;
    }

    await this.renderProductData();
    return this.element;
  }

  createImagesData = () => {
    const imgArr = [];
    [...this.subElements.imageListContainer.firstElementChild.children].forEach(node => {
      imgArr.push({ url: node.children[0].value, source: node.children[1].value });
    });
    return imgArr;
  }

  createDataToSend = () => {
    const data = {
      title: this.subElements.productForm.title.value,
      description: this.subElements.description.value,
      subcategory: this.subElements.subcategory.value,
      price: +this.subElements.price.value,
      quantity: +this.subElements.quantity.value,
      discount: +this.subElements.discount.value,
      status: +this.subElements.status.value,
      images: this.createImagesData()
    };

    if (this.productId) {
      data.id = this.productId
    }

    return data;
  }

  save = async () => {
    let fetchMethod;
    let dispatchEvent;
    if (!this.productId) {
      fetchMethod = 'PUT';
      dispatchEvent = this.dispatchProductSavedEvent;
    } else {
      fetchMethod = 'PATCH';
      dispatchEvent = this.dispatchProductUpdatedEvent;
    }

    const response = await fetch('https://course-js.javascript.ru/api/rest/products', {
      method: fetchMethod,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(this.createDataToSend())
    });

    if (response.ok) {
      dispatchEvent();
    }
  }

  submitFormHandler = async (e) => {
    e.preventDefault();
    await this.save();
  }

  addSubmitFormListener = () => {
    this.subElements.productForm.addEventListener('submit', this.submitFormHandler);
  }

  removeSubmitFormListener = () => {
    this.subElements.productForm.removeEventListener('submit', this.submitFormHandler);
  }

  dispatchProductUpdatedEvent = () => {
    const event = new CustomEvent('product-updated', {
      bubbles: true
    });

    this.element.dispatchEvent(event);
  }

  dispatchProductSavedEvent = () => {
    const event = new CustomEvent('product-saved', {
      bubbles: true
    });

    this.element.dispatchEvent(event);
  }

  remove = () => {
    this.element.remove();
  }

  destroy = () => {
    this.remove();
    this.removeSubmitFormListener();
    this.removeUploadImgListener();
    this.removeRemoveImgListener();
  }

  createInputFileTemplate = () => {
    return `<input type="file" accept="image/*" />`;
  }

  uploadImg = () => {
    const inputFile = this.createElement(this.createInputFileTemplate());
    document.body.append(inputFile);

    inputFile.addEventListener("cancel", () => {
      inputFile.remove();
    });

    inputFile.addEventListener("change", async () => {
      const formData = new FormData();
      formData.append('image', inputFile.files[0], inputFile.files[0].name)

      const result = await fetchJson('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
      });

      const imgData = { url: result.data.link, source: inputFile.files[0].name };
      this.createImageListElement([imgData]);

      inputFile.remove();
    });

    inputFile.click();
  }

  addUploadImgListener = () => {
    this.element.querySelector(`button[name="uploadImage"]`).addEventListener('click', this.uploadImg);
  }

  removeUploadImgListener = () => {
    this.element.querySelector(`button[name="uploadImage"]`).removeEventListener('click', this.uploadImg);
  }

  removeImgListItemHandler = (e) => {
    const target = e.target.closest('.products-edit__imagelist-item button');
    if (target) {
      target.parentElement.remove();
    }
  }

  addRemoveImgListener = () => {
    this.subElements.imageListContainer.addEventListener('click', this.removeImgListItemHandler);
  }

  removeRemoveImgListener = () => {
    this.subElements.imageListContainer.removeEventListener('click', this.removeImgListItemHandler);
  }
}
