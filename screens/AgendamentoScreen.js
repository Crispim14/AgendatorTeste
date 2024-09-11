import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function AgendamentoScreen({ navigation, route }) {
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState(moment().format('YYYY-MM-DD'));
  const [horario, setHorario] = useState('');
  const [servico, setServico] = useState('');
  const [profissional, setProfissional] = useState('');

  const handleSalvarAgendamento = async () => {
    const storedAgendamentos = await AsyncStorage.getItem('agendamentos');
    let agendamentos = storedAgendamentos ? JSON.parse(storedAgendamentos) : [];

    const conflito = agendamentos.find(a => a.data === data && a.horario === horario);

    if (conflito) {
      Alert.alert(
        'Conflito de Horário',
        'Já existe um agendamento para esse horário. Deseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim', onPress: () => salvar(agendamentos) },
        ]
      );
    } else {
      salvar(agendamentos);
    }
  };

  const salvar = async (agendamentos) => {
    const novoAgendamento = {
      id: Math.random().toString(36).substr(2, 9),
      nomeCliente,
      telefone,
      data,
      horario,
      servico,
      profissional,
    };

    agendamentos.push(novoAgendamento);
    await AsyncStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    Alert.alert('Sucesso', 'Agendamento salvo com sucesso!');
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Nome do Cliente</Text>
      <TextInput value={nomeCliente} onChangeText={setNomeCliente} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Telefone</Text>
      <TextInput value={telefone} onChangeText={setTelefone} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Data</Text>
      <TextInput value={data} onChangeText={setData} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Horário</Text>
      <TextInput value={horario} onChangeText={setHorario} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Serviço</Text>
      <TextInput value={servico} onChangeText={setServico} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Profissional (Opcional)</Text>
      <TextInput value={profissional} onChangeText={setProfissional} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Salvar Agendamento" onPress={handleSalvarAgendamento} />
    </ScrollView>
  );
}
