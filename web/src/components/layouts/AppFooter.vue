<template>
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-md-12 text-center text-white" id="copyright">
                    Copyright {{ year }}
                </div>
            </div>
        </div>
    </footer>

</template>

<script>
    import { computed } from 'vue'

    export default {
        setup() {
            const year = computed(function () {
                return new Date().getFullYear();
            });
            return { year };
        }
    }
</script>

<style>
    #copyright {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: lightseagreen;
        text-align: center;
        font-size: 20px;
    }
    #copyright a:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>