<script lang="ts" setup>
defineEmits(["toggle-add-modal"]);
const { categories, search } = storeToRefs(useStore());
const { categoryCount } = useStore();
const {
    name,
    showCategoryDropdown,
    showAddCategory,
    openAddCategory,
    addNewCategory,
    toggleCategoryDropdown,
} = useCategory();
</script>

<template>
    <div class="page__actions d-flex align-items-center justify-content-space-between">
        <form>
            <input v-model="search" type="search" name="search" placeholder="Search" />
            <label for="search">
                <IconSearch />
            </label>
        </form>

        <div class="page__actions-ctas">
            <div class="categories position-relative">
                <button class="d-flex align-items-center" style="gap: 1rem" @click="toggleCategoryDropdown">
                    Categories
                    <IconCaret :direction="showCategoryDropdown ? 'up' : 'down'" />
                </button>
                <button @click="openAddCategory">
                    <IconAdd />
                </button>

                <div v-show="showCategoryDropdown" class="dropdown position-absolute d-flex flex-column align-items-start">
                    <button v-for="category in categories"
                        class="d-flex align-items-center justify-content-space-between w-100">
                        <span class="category weight-600 text-transform-capitalize">
                            {{ category.name }}
                        </span>
                        <span class="count d-flex align-items-center justify-content-center">
                            {{ categoryCount(category._id) }}
                        </span>
                    </button>

                    <form v-if="showAddCategory" class="w-100" @submit.prevent="addNewCategory">
                        <input v-model="name" class="w-100" type="text" placeholder="Category name" />
                    </form>
                </div>
            </div>
            <button class="add-pass weight-600 d-flex align-items-center justify-content-center"
                @click="$emit('toggle-add-modal')">
                <IconAdd />
                Add New
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.page__actions {
    margin-bottom: 3.4rem;

    @media screen and (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }

    @media screen and (max-width: 950px) {
        gap: 1rem;
    }

    form {
        position: relative;
        width: 35rem;
        height: 4.2rem;
        border-radius: 0.8rem;
        background-color: $col-lightGrey;
        padding: 0 1.3rem;

        @media screen and (max-width: 768px) {
            width: 100%;
        }

        input {
            width: 100%;
            height: 100%;
            border: none;
            background-color: transparent;
            outline: none;
            @include font(1.4rem, 2rem);
            color: $col-black;
        }

        label {
            position: absolute;
            top: 50%;
            right: 1.3rem;
            transform: translateY(-50%);
        }
    }

    &-ctas {
        @media screen and (max-width: 768px) {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .categories {
            display: none;

            @media screen and (max-width: 768px) {
                display: flex;
                align-items: center;
                gap: 2.8rem;
                @include font(1.4rem, 2rem);
                color: $col-lightBlack;
            }

            @media screen and (max-width: 370px) {
                gap: 1rem;
            }

            .dropdown {
                top: 3rem;
                left: 0;
                width: 22rem;
                padding: 2rem;
                background-color: $col-white;
                border-radius: 1.1rem;
                box-shadow: #64646f33 0px 7px 29px 0px;
                z-index: 9999999;
                gap: 2rem;

                button {
                    @include font(1.6rem, 3.3rem);
                    font-weight: 400;
                    gap: 1.2rem;
                    color: $col-black;

                    .count {
                        width: 2.4rem;
                        height: 2.4rem;
                        border-radius: 0.4rem;
                        background-color: $col-lightBlack;
                        @include font(1.4rem, 2rem);
                        color: $col-fadedBlack;
                    }
                }
            }
        }
    }

    .add-pass {
        width: 11.1rem;
        height: 4.2rem;
        border-radius: 0.8rem;
        background-color: $col-bluePurple;
        color: $col-white;
        @include font(1.4rem, 2rem);
        gap: 0.8rem;
        transition: opacity 0.2s ease-in-out;

        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
