import { useState, useContext, useEffect, useRef } from 'react';
import { Layout } from 'antd';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Spin, message, Statistic, Tooltip} from 'antd';
import { api } from '../../services/api';
import { addMinutes, differenceInMinutes, parseISO, minutesToHours, format} from 'date-fns'
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';

const Movimentacao = ({
    addVisible, 
    showDrawer, 
    hiddeDrawer, 
    quarto, 
    listarQuartos, 
    limparStateQuarto,
    quartos,
    tipoRegistro,
    movimentacao,
    isAuthenticated,
    abrirConsumo
  }) => {
    const [ loading, setLoading ] = useState(false)
    const [fields, setFields] = useState([]);
    const [tempo, setTempo] = useState(null);

    const [form] = Form.useForm();

    const { Option } = Select;
    const { TextArea } = Input;
    const { Countdown } = Statistic;

    const [num, setNum] = useState(100);
    const [pause, setPause] = useState(false);
    const [horaHEntrada, setHEntrada] = useState(null);
    const [tempoUsoString, setTempoUsoString] = useState(null);
    const [totalConsumoHora, setTotalConsumoHora] = useState(0);
    const [totalConsumoProdutos, setTotalConsumoProdutos] = useState(0);
    let intervalRef = useRef();

    const valcValor = (tempo, valor) => {
      // console.log('Tempo valor', tempo, valor)
      var tempoHora = parseInt(tempo.hora)
      var tempoMinuto = parseInt(tempo.minuto)
      var totalHota = tempo.hora >= 2 ? tempoHora - 1 : 1

      var val = 0
      if(tempo.hora < 1){
        console.log('Menos ou igual a 1h', tempoHora)
        val = val + valor
        // if(tempoMinuto > 15){
        //   val = val + 15
        // }
      }else if(tempo.hora >= 1 && tempo.hora < 2){
        console.log('maior que 1h e menor que 2h', tempoHora)
        val = val + valor
        if(tempoMinuto >= 15){
          val = val + 15
        }
      }else if(tempo.hora >= 2){
        console.log('Maior que 2h', tempoHora)
        // console.log('Dados', tempoHora)
        var horasAdicionais = 15 * totalHota
        // console.log('tempo adicional ', totalHota, '=', horasAdicionais)

        val = horasAdicionais + valor

        if(tempoMinuto >= 15){
          val = val + 15
        }
      }

      // console.log('valor ', val)
      setTotalConsumoHora(val)
    }

    const decreaseNum = () => {
      setNum((prev) => prev - 1)
      if(movimentacao){
        const result = differenceInMinutes(
          new Date(),
          parseISO(movimentacao.created_at),
        )
        // setTempoUso(result)
        const resultHor = minutesToHours(result)
        // console.log('result', result, resultHor)


        var dtSaida = moment().format('DD/MM/YYYY HH:mm:ss');
        var dtEntrada = moment(movimentacao.created_at).format('DD/MM/YYYY HH:mm:ss');
        // console.log('dtSaida', dtSaida)
        // console.log('dtEntrada', dtEntrada)
        // var dtEntrada = dEntrada + ' ' + hEntrada + ':00';
        var ms = moment(dtSaida,"DD/MM/YYYY HH:mm:ss").diff(moment(dtEntrada,"DD/MM/YYYY HH:mm:ss"));
        var d = moment.duration(ms);
        var s = Math.floor(d.asHours()) + "h" + moment.utc(ms).format(" mm") +"m";
        // console.log('===>', Math.floor(d.asHours()), moment.utc(ms).format("mm"), s)
        setTempoUsoString(s)
        valcValor({'hora' : Math.floor(d.asHours()), 'minuto': moment.utc(ms).format("mm")}, quarto.quarto_valor_hora)
      }
    };

    useEffect(() => {
      intervalRef.current = setInterval(decreaseNum, 1000);
      
      // setTempoUso(addMinutes(new Date(), 30))
      return () => clearInterval(intervalRef.current);
    }, []);
    

    const key = 'updatable';

    useEffect(() => {
      setTempo(Date.now('2021-12-31 14:55:43') + 1000 * 60 * 60 * 24 * 2 + 1000 * 30); 
      // console.log('quarto carregado', quarto)
      // console.log('movimentacao carregado', movimentacao)
      // console.log('quarto.created_at', movimentacao.created_at)
      setHEntrada(moment(movimentacao.created_at).format('DD/MM/YYYY HH:mm:ss'))

      listarConsumo()
      if(quarto){
        setFields([
          { name: ['quarto'], value: quarto.id },
          { name: ['tipo'], value: movimentacao ? movimentacao.tipo : '' },
          { name: ['tipo_veiculo'], value: movimentacao ? movimentacao.tipo_veiculo : '' },
          { name: ['placa_veiculo'], value: movimentacao ? movimentacao.placa_veiculo : '' },
          { name: ['obs'], value: movimentacao ? movimentacao.obs_movimentacao : ''},
        ])
      }
    }, []);

    const openMessage = (tipo) => {
        if(tipo){
            message.success({ content: 'Cadastro feito com sucesso!', key });
        }else{
            message.error({ content: 'Erro ao cadastrar', key, duration: 2 });
        }
    };

    const onFinish = async (values) => {
      console.log('Success:', values);
      if(tipoRegistro === 'Editar'){
        // console.log('Editando quarto', values)
          editar(values)
      }else{
          salvar(values)
      }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onValuesChange = (value) => {
        // console.log('onValuesChange:', value);
    };

    function onFinishTempo() {
      console.log('finished!');
    }


    async function listarConsumo(){
      var key = 'listar'
      try {
        const {data : result} = await api.get(`movimentacao-produtos/${movimentacao.id}`);
        console.log("Result consumo", result)
        // setConsumo(result)
        var total = 0
        for (let t = 0; t < result.length; t++) {
          const element = result[t];
          console.log('Element for', element)
          total = total += element.valor_total
        }
        setTotalConsumoProdutos(total)
        // message.success({ content: 'Todos os produtos foram listados!', key });
      } catch (error) {
        console.log("Erro ao listar consumo", error, error.response);
        message.error({ content: 'Erro ao listar consumo', key, duration: 2 });
      }
    }


    async function editar(value){
      setLoading(true)
      let form_data = new FormData();
  
      // form_data.append("quarto_id", value.quarto);
      // form_data.append("tipo", value.tipo);
      // form_data.append("tipo_veiculo", value.tipo_veiculo);
      // form_data.append("placa_veiculo", value.placa_veiculo);
      // form_data.append("valor_hora", quarto.quarto_valor_hora);
      form_data.append("tempo_usado", tempoUsoString);
      form_data.append("cortesia", 'Não');
      form_data.append("valor_hora_total", totalConsumoHora);
      form_data.append("valor_consumo_total", totalConsumoProdutos);
      form_data.append("obs_movimentacao", value.obs);
  
      await api
          .post(`/movimentacao/${movimentacao.id}`, form_data, {
            headers: {
              "content-type": "application/json",
              Accept: "application/json"
            }
          })
          .then(res => {
              console.log("Adicionado com sucesso", res.data)
              setLoading(false)
              openMessage(true)
              // showDrawer()
              listarQuartos()
              form.resetFields();
              editarQuarto(res.data, 'Livre')
          })
          .catch(error => {
            console.log("error: ", error, error.response)
            console.log("response: ", error.response.data.message)
            setLoading(false)
            openMessage(false)
          });
    }


    async function salvar(value) {
        setLoading(true)
        let form_data = new FormData();
    
        form_data.append("quarto_id", value.quarto);
        form_data.append("tipo", value.tipo);
        form_data.append("tipo_veiculo", value.tipo_veiculo);
        form_data.append("placa_veiculo", value.placa_veiculo);
        form_data.append("valor_hora", quarto.quarto_valor_hora);
        form_data.append("obs_movimentacao", value.obs);
    
        await api
            .post(`/movimentacao`, form_data, {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              }
            })
            .then(res => {
                console.log("Adicionado com sucesso", res.data)
                setLoading(false)
                openMessage(true)
                // showDrawer()
                listarQuartos()
                form.resetFields();
                editarQuarto(res.data, 'Ocupado')
            })
            .catch(error => {
              console.log("error: ", error, error.response)
              console.log("response: ", error.response.data.message)
              setLoading(false)
              openMessage(false)
            });
    }

    async function editarQuarto(value, status){
      setLoading(true)
      let form_data = new FormData();
      key = 'editar'
      form_data.append("status", status);
      await api
          .post(`/quarto/${value.quarto_id}`, form_data)
          .then(res => {
              console.log("Quarto editado", res.data)
              message.success({ content: 'Status do quarto foi alterado!', key });
              setLoading(false)
              setFields([])
              // limparStateQuarto()
              listarQuartos()
              // showDrawer()
              hiddeDrawer()
              salvarMovimentacaoUser(value, status === 'Livre' ? 'Saída' : 'Entrada')
              form.resetFields();
          })
          .catch(error => {
            console.log("error: ", error, error.response)
            setLoading(false)
            message.error({ content: 'Erro ao editar status', key, duration: 2 });
          });
    }

    async function salvarMovimentacaoUser(value, tipo){
      let form_data = new FormData();
      form_data.append("quarto_movimentacao_id", value.id);
      form_data.append("movimentacao_tipo", tipo);
      await api
          .post(`/movimentacao-user/`, form_data)
          .then(res => {
              console.log("Quarto editado", res.data)
              message.success({ content: 'Status do quarto foi alterado!', key });
              setLoading(false)
              setFields([])
              // limparStateQuarto()
              listarQuartos()
              // showDrawer()
              hiddeDrawer()
              form.resetFields();
          })
          .catch(error => {
            console.log("error: ", error, error.response)
            setLoading(false)
            message.error({ content: 'Erro ao salvar movimentação do usuário', key, duration: 2 });
          });
    }

    return(
        <Drawer
          title={'Movimentação de entrada e saída'}
          width={720}
          onClose={hiddeDrawer}
          visible={addVisible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={hiddeDrawer}>Cancelar</Button>
            </Space>
          }
        >
          <Form 
            form={form}
            layout="vertical" 
            hideRequiredMark
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={onValuesChange}
            fields={fields}
            onFieldsChange={(_, allFields) => {
                setFields(allFields);
                console.log('onChange ', allFields)
            }}
            autoComplete="off"
            className='formCadastro' 
          >
            <Row>
              <Col span={12}>
                <div 
                  style={{
                    width: '100%', 
                    height: 50, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    background: tipoRegistro === 'Novo' ? 'green' : 'gray',
                    color:'#fff',
                    marginBottom: 10,
                    cursor: 'pointer'
                  }}
                  // onClick={() => {
                  //   setTipoAbertura('ENTRADA')
                  // }}
                >
                  <span>
                  <div>ENTRADA</div>
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div 
                  style={{
                    width: '100%', 
                    height: 50, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    background: tipoRegistro === 'Editar' ? 'red' : 'gray',
                    color:'#fff',
                    marginBottom: 10,
                    cursor: 'pointer'
                  }}
                  // onClick={() => {
                  //   setTipoAbertura('SAÍDA')
                  // }}
                >
                  <span>
                    SAÍDA
                  </span>
                </div>
              </Col>
            </Row>
            {tipoRegistro === 'Editar' && (
              <Row style={{marginBottom: 20}} gutter={16}>
                <Col span={24}>
                  {horaHEntrada && (
                    <Statistic title="Entrada" value={horaHEntrada}/>
                  )}
                </Col>
                <Col span={6}>
                  <Statistic title="Valor hora" value={quarto.quarto_valor_hora} precision={2}/>
                </Col>
                <Col span={6}>
                  <Statistic title="Tempo usado" value={tempoUsoString ? tempoUsoString : 'Aguarde ...'} />
                </Col>
                <Col span={6}>
                  <Statistic title="Total" value={totalConsumoHora === 0 ? 'Aguarde': totalConsumoHora} precision={2} />
                </Col>
                <Col span={6}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <Statistic title="Consumo" value={totalConsumoProdutos} precision={2} />
                    <Tooltip title="Abrir consumo">
                      <Button onClick={() => {abrirConsumo(quarto, 'Novo')}} type="primary" shape="circle" icon={<SearchOutlined />} />
                    </Tooltip>
                  </div>
                </Col>
              </Row>
            )}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="tipo"
                  label="Tipo de entrada/saída *"
                  rules={[{ required: true, message: 'O tipo é obrigatório' }]}
                >
                  <Select disabled={tipoRegistro === 'Editar' ? true : false} size="large" placeholder="Defina o tipo">
                    <Option value="Cliente">Cliente</Option>
                    <Option value="Funcionário">Funcionário</Option>
                    <Option value="Diversos">Diversos</Option>
                    <Option value="Manutenção">Manutenção</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="quarto"
                  label="Quarto *"
                  rules={[{ required: true, message: 'O quarto é obrigatório' }]}
                >
                  <Select disabled={tipoRegistro === 'Editar' ? true : false} size="large" placeholder="Escolha o quarto">
                    {quartos.map((item, key) => (
                      <Option key={key} value={item.id}>{item.quarto_nome}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="tipo_veiculo"
                  label="Tipo do veículo *"
                  rules={[{ required: true, message: 'O tipo do veículo é obrigatório' }]}
                >
                  <Select disabled={tipoRegistro === 'Editar' ? true : false} size="large" placeholder="Defina o tipo do veículo">
                    <Option value="Carro">Carro</Option>
                    <Option value="Moto">Moto</Option>
                    <Option value="Bicicleta">Bicicleta</Option>
                    <Option value="A pé">A pé</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="placa_veiculo"
                  label="Placa do veiculo *"
                  rules={[{ required: true, message: 'A placa é obrigatório' }]}
                >
                  <Input disabled={tipoRegistro === 'Editar' ? true : false} size="large" placeholder="Digite a placa do veículo" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item 
                  name="obs"
                  label="Observação da movimentação"
                  rules={[{ required: false, message: '' }]}
                >
                  <Input.TextArea rows={4} placeholder="Observações da movimentação" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item >
                    <Button style={{width: '100%', background: tipoRegistro === 'Novo' ? 'red' : 'green'}} type="primary" htmlType="submit">
                        {tipoRegistro === 'Novo' ? 'Ocupar quarto' : 'Liberar quarto'}
                    </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {loading && (
            <div className='loading'>
                <Spin size="large" />
                Salvando ...
            </div>
          )}
        </Drawer>
    )
}

export default Movimentacao;