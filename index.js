const buttonCart = document.querySelector('.header-menu__button_cart')
const cart = document.querySelector('.cart')
const addCart = document.querySelector('.add-cart')
const cartSum = document.querySelector('.cart__sum')
const itemPrice = 18_600

let isOpenCart = false

const fadeOut = (element) => {
    let opacity = 1
    const timer = setInterval(function () {
        if (opacity <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none'
        }
        element.style.opacity = `${opacity}`
        opacity -= opacity * 0.1
    }, 10)
}

const fadeIn = (element, display = 'block') => {
    let opacity = 0.1
    element.style.display = display
    const timer = setInterval(function () {
        if (opacity >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = `${opacity}`
        opacity += opacity * 0.1
    }, 10)
}

const updateCart = () => {
    const cartItems = document.querySelectorAll('.cart__item')

    cartItems.forEach(item => {
        const buttonPlus = item.querySelector('.counter__button_plus')
        const buttonMinus = item.querySelector('.counter__button_minus')

        buttonPlus.addEventListener('click', onClickCounter)
        buttonMinus.addEventListener('click', onClickCounter)
    })
}

const onClickButtonCart = () => {
    openCloseCart(!isOpenCart)
}

const openCloseCart = (value) => {
    isOpenCart = value
    if (isOpenCart) {
        fadeIn(cart)
    } else {
        fadeOut(cart)
    }
}

const onClickCounter = (event) => {
    let sign = 1

    event.target.classList.forEach(item => {
        if (item === 'counter__button_minus') {
            sign = -1
        } else if (item === 'counter__button_plus') {
            sign = 1
        }
    })


    const sum = event.target.parentElement.parentElement.querySelector('.product__price')
    const value = event.target.parentElement.querySelector('.counter__value')
    const newValue = Number(value.textContent) + sign

    if (sign === -1) {
        if (newValue > 0) {
            value.innerHTML = String(newValue)
            sum.innerHTML = `${(itemPrice * newValue).toLocaleString()} ₽`
            updateSum(itemPrice, -1)
        }

        if (newValue === 0) {
            event.target.parentElement.parentElement.parentElement.remove()
            updateCardBadge(-1)
            updateSum(itemPrice, -1)
        }
    } else {
        if (newValue <= 20) {
            value.innerHTML = String(newValue)
            sum.innerHTML = `${(itemPrice * newValue).toLocaleString()} ₽`
            updateSum(itemPrice)
        }
    }

}

const onClickAddCart = () => {
    const cart = document.querySelector('.cart__list')
    cart.insertAdjacentHTML('beforeend', `
        <li class="cart__item product">
                    <img src="assets/door.jpg" alt="product image" class="product__image"/>
                    <div class="product__information">
                        <p class="product__title">Браво-22 Snow Melinga / Magic Fog</p>
                        <p class="product__category">Межкомнатная дверь</p>
                    </div>
                    <div class="product__price-information">
                        <p class="product__price">${itemPrice.toLocaleString()} ₽</p>
                        <div class="product__count counter">
                            <button class="counter__button counter__button_minus">-</button>
                            <p class="counter__value">1</p>
                            <button class="counter__button counter__button_plus">+</button>
                        </div>
                    </div>
                </li>
    `)

    updateSum(itemPrice)
    updateCardBadge()
    updateCart()
}

const updateCardBadge = (value = 1) => {
    const badge = buttonCart.querySelector('.icon-button__badge')
    badge.innerHTML = `${+badge.textContent + value}`
}

const updateSum = (value, sign = 1) => {
    const sum = cartSum.querySelector('em')
    const sumValue = sum.textContent.replaceAll(' ', '')
    const newSum = Number(sumValue) + value * sign

    sum.innerHTML = addSpaces(newSum)
}

const addSpaces = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

buttonCart.addEventListener('click', onClickButtonCart)
addCart.addEventListener('click', onClickAddCart)

const handleClickOutside = (event) => {
    if (event.target === cart || cart.contains(event.target) || event.target === buttonCart || buttonCart.contains(event.target)) {
        return
    }

    if (event.target === modalContent || modalContent.contains(event.target) || event.target === contactButton || contactButton.contains(event.target)) {
        return
    }

    openCloseCart(false)
    closeModal()
}

updateCart()


const contactButton = document.querySelector('.header-contacts__button')
const modal = document.querySelector('.contact-modal')
const modalContent = document.querySelector('.contact-modal__content')
const modalClose = document.querySelector('.contact-modal__close')
const modalForm = document.querySelector('.contact-modal__form')
const inputForm = document.querySelectorAll('.contact-modal__input')

const onInput = (event) => {
    event.target.classList.remove('contact-modal__input_error')
}

inputForm.forEach(item => {
    item.addEventListener('input', onInput)
})

const openModal = () => {
    fadeIn(modal, 'flex')
}

const closeModal = () => {
    fadeOut(modal)
}

const onSubmit = (event) => {
    event.preventDefault()
    const elems = Array.from(modalForm.elements).filter((item) => !!item.name)

    const isValid = validation(elems)

    if (isValid) {
        elems
            .forEach((element) => {
                const {name, type} = element
                const value = type === 'checkbox' ? element.checked : element.value
                console.log(name, ': ', value)
            })

        closeModal()
    }
}

const validation = (elements) => {
    let isValid = true

    elements.forEach(item => {
        const { type } = item
        const value = type === 'checkbox' ? item.checked : item.value

        if (!value) {
            item.classList.add('contact-modal__input_error')
            isValid = false
        }
    })

    return isValid
}

contactButton.addEventListener('click', openModal)
modalClose.addEventListener('click', closeModal)

document.addEventListener("click", handleClickOutside);
modalForm.addEventListener('submit', onSubmit)