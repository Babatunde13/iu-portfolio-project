<script lang="ts" setup>
const { categories } = storeToRefs(useStore());
const { categoryCount } = useStore();
const { name, showAddCategory, addNewCategory } = useCategory();
</script>

<template>
    <div class="sidebar">
        <div class="sidebar__header d-flex align-items-center justify-content-space-between">
            <h2 class="weight-600">Categories</h2>
            <button @click="showAddCategory = !showAddCategory">
                <IconAdd />
            </button>
        </div>

        <ul v-if="categories.length > 0" class="sidebar__list d-flex flex-column w-100">
            <li class="sidebar__list-item" v-for="category in categories">
                <button class="w-100 d-flex align-items-center justify-content-space-between">
                    <span class="category weight-600">{{ category.name }}</span>
                    <span class="count d-flex align-items-center justify-content-center">
                        {{ categoryCount(category._id) }}
                    </span>
                </button>
            </li>
        </ul>

        <span v-else>No categories yet!</span>

        <form v-if="showAddCategory" class="w-100" @submit.prevent="addNewCategory">
            <input v-model="name" class="w-100" type="text" placeholder="Category name" />
        </form>
    </div>
</template>

<style scoped lang="scss">
.sidebar {
    width: 37.5rem;
    height: 100vh;
    background-color: $col-white;
    padding: 3.4rem 6rem;
    border-right: 0.1rem solid $col-grey;
    overflow-y: auto;

    @media screen and (max-width: 768px) {
        display: none;
    }

    @media screen and (max-width: 950px) {
        width: 25rem;
        padding: 3.4rem;
    }

    &__header {
        margin-bottom: 2.1rem;

        h2 {
            @include font(1.4rem, 2rem);
            color: $col-lightBlack;
        }
    }

    &__list {
        gap: 1.2rem;

        &-item {
            button {
                padding-left: 2rem;
                transition: background-color 0.2s ease-in-out;

                &:hover {
                    background-color: $col-bluePurple;
                    border-radius: 0.6rem;
                }

                &:hover .category,
                &:hover .count {
                    background-color: $col-bluePurple;
                    color: $col-white;
                }

                @media screen and (max-width: 950px) {
                    padding-left: 0;
                }

                .category {
                    @include font(1.4rem, 2rem);
                    color: $col-black;
                }

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

    form {
        margin: 2.1rem 0;

        input {
            height: 4rem;
            border-radius: 0.6rem;
            border: 0.1rem solid $col-grey;
            padding: 0 1.6rem;
            @include font(1.4rem, 2rem);
            color: $col-fadedBlack;
        }
    }
}
</style>
