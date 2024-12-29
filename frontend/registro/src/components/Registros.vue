<template>
    <div>
        <h1>Registros</h1>
        <ul>
            <li v-for="registro in registros" :key="registro.id">
                {{ registro.nome }} - {{ registro.valor }}
                <button @click="prepararEdicao(registro)">Editar</button>
                <button @click="deletarRegistro(registro.id)">Deletar</button>
            </li>
        </ul>
        <form @submit.prevent="criarRegistro">
            <input v-model="novoRegistro.nome" placeholder="Nome" />
            <input v-model.number="novoRegistro.valor" placeholder="Valor" />
            <button type="submit">Adicionar</button>
        </form>
        <div v-if="registroEditando">
            <h2>Editar Registro</h2>
            <form @submit.prevent="atualizarRegistro">
                <input v-model="registroEditando.nome" placeholder="Nome" />
                <input v-model.number="registroEditando.valor" placeholder="Valor" />
                <button type="submit">Salvar</button>
                <button @click="cancelarEdicao">Cancelar</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            registros: [],
            novoRegistro: {
                nome: '',
                valor: ''
            },
            registroEditando: null
        };
    },
    created() {
        this.buscarRegistros();
    },
    methods: {
        async buscarRegistros() {
            try {
                const response = await axios.get('http://localhost:3000/registros');
                this.registros = response.data;
            } catch (error) {
                console.error('Erro ao buscar registros:', error);
            }
        },
        async criarRegistro() {
            try {
                await axios.post('http://localhost:3000/registros', this.novoRegistro);
                this.novoRegistro.nome = '';
                this.novoRegistro.valor = '';
                this.buscarRegistros();
            } catch (error) {
                console.error('Erro ao criar registro:', error);
            }
        },
        prepararEdicao(registro) {
            this.registroEditando = { ...registro };
        },
        async atualizarRegistro() {
            try {
                await axios.put(`http://localhost:3000/registros/${this.registroEditando.id}`, this.registroEditando);
                this.registroEditando = null;
                this.buscarRegistros();
            } catch (error) {
                console.error('Erro ao atualizar registro:', error);
            }
        },
        cancelarEdicao() {
            this.registroEditando = null;
        },
        async deletarRegistro(id) {
            try {
                await axios.delete(`http://localhost:3000/registros/${id}`);
                this.buscarRegistros();
            } catch (error) {
                console.error('Erro ao deletar registro:', error);
            }
        }
    }
};
</script>
