<template>
    <div class="toast" v-if="text && text.length > 0">
        <span >
            {{text}}
        </span>
    </div>
</template>
<script>
    import eventBus from '../assets/eventBus';

    export default{
        data() {
            return {
                text: '',
                timer: null
            }
        },
        created() {
            eventBus.$on('showToast', (text)=>{
                this.text = text;

                this.timer = setTimeout(()=>{
                    this.text = '';
                }, 2000);
            })
        }
    }
</script>

<style lang="scss">
    .toast{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        padding: 10px 15px;
        color: #fff;
        background: rgba(0,0,0,0.7);
        border-radius: 4px;
    }
</style>