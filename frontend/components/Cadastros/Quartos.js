import { useState, useContext, useEffect } from 'react';
import { Layout } from 'antd';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Spin, message } from 'antd';
import { api } from '../../services/api';

const Produtos = ({addVisible, showDrawer, hiddeDrawer, quarto, listarQuartos, limparStateQuarto}) => {
    const [ loading, setLoading ] = useState(false)
    const [fields, setFields] = useState([]);

    const [form] = Form.useForm();

    const { Option } = Select;

    const key = 'updatable';

    useEffect(() => {
      console.log('quarto carregado', quarto)
      if(quarto){
        setFields([
          { name: ['nome'], value: quarto.quarto_nome },
          { name: ['valor'], value: quarto.quarto_valor_hora },
          { name: ['tipo'], value: quarto.quarto_tipo },
          { name: ['status'], value: quarto.status },
        ])
      }
    }, []);

    const openMessage = (tipo) => {
        if(tipo){
            message.success({ content: 'Quarto cadastrado com sucesso!', key });
        }else{
            message.error({ content: 'Erro ao cadastrar quarto', key, duration: 2 });
        }
    };

    const onFinish = async (values) => {
      console.log('Success:', values, quarto);
      if(quarto){
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


    async function editar(value){
      setLoading(true)
      let form_data = new FormData();
      key = 'editar'
      form_data.append("quarto_nome", value.nome);
      form_data.append("quarto_valor_hora", value.valor);
      form_data.append("quarto_tipo", value.tipo);
      form_data.append("status", value.status);
      await api
          .post(`/quarto/${quarto.id}`, form_data)
          .then(res => {
              console.log("Quarto editado", res.data)
              message.success({ content: 'Quarto editado com sucesso!', key });
              setLoading(false)
              setFields([])
              limparStateQuarto()
              listarQuartos()
              showDrawer()
              form.resetFields();
          })
          .catch(error => {
            console.log("error: ", error, error.response)
            setLoading(false)
            message.error({ content: 'Erro ao editar quarto', key, duration: 2 });
          });
    }


    async function salvar(value) {
        setLoading(true)
        let form_data = new FormData();
    
        form_data.append("quarto_nome", value.nome);
        form_data.append("quarto_valor_hora", value.valor);
        form_data.append("quarto_tipo", value.tipo);
        form_data.append("status", value.status);
    
        await api
            .post(`/quarto`, form_data, {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              }
            })
            .then(res => {
                console.log("Adicionando quarto", res.data)
                setLoading(false)
                openMessage(true)
                showDrawer()
                listarQuartos()
                form.resetFields();
            })
            .catch(error => {
              console.log("error: ", error, error.response)
              console.log("response: ", error.response.data.message)
              setLoading(false)
              openMessage(false)
            });
    }


    return(
        <Drawer
          title={!quarto ? 'Cadastrar novo quarto' : 'Editar dados do quarto'}
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="nome"
                  label="Nome do quarto *"
                  rules={[{ required: true, message: 'O nome é obrigatório' }]}
                >
                  <Input placeholder="Nome do quarto" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="valor"
                  label="Valor hora do quarto *"
                  rules={[{ required: true, message: 'O valor é obrigatório' }]}
                >
                  <Input placeholder="Ex: 10.00" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="tipo"
                  label="Tipo do quarto *"
                  rules={[{ required: true, message: 'O tipo é obrigatório' }]}
                >
                  <Select placeholder="Defina o status">
                    <Option value="Comum">Comum</Option>
                    <Option value="Suíte">Suíte</Option>
                    <Option value="Temáticos">Temáticos</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status do quarto *"
                  rules={[{ required: true, message: 'O status é obrigatório' }]}
                >
                  <Select placeholder="Defina o status">
                    <Option value="Livre">Livre</Option>
                    <Option value="Ocupado">Ocupado</Option>
                    <Option value="Reservado">Reservado</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item >
                    <Button style={{width: '100%'}} type="primary" htmlType="submit">
                        {quarto ? 'Atualizar dados' : 'Salvar quarto'} 
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

export default Produtos;