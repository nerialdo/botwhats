import { useState, useContext, useEffect } from 'react';
import { Layout } from 'antd';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Spin, message } from 'antd';
import { api } from '../../services/api';

const Produtos = ({addVisible, showDrawer, hiddeDrawer, produto, listarProdutos, limparStateProduto}) => {
    const [ loading, setLoading ] = useState(false)
    const [fields, setFields] = useState([]);

    const [form] = Form.useForm();

    const { Option } = Select;

    const key = 'updatable';

    useEffect(() => {
      console.log('produto', produto)
      if(produto){
        setFields([
          { name: ['nome'], value: produto.produto_nome },
          { name: ['valor'], value: produto.produto_valor },
          { name: ['qto'], value: produto.produto_qto },
          { name: ['status'], value: produto.status },
          { name: ['descricao'], value: produto.descricao },
        ])
      }
    }, []);

    const openMessage = (tipo) => {
        if(tipo){
            message.success({ content: 'Produto cadastrado com sucesso!', key });
        }else{
            message.error({ content: 'Erro ao cadastrar produto', key, duration: 2 });
        }
    };

    const onFinish = async (values) => {
      console.log('Success:', values, produto);
      if(produto){
          console.log('EDITANDO', produto);
          editar(values)
        }else{
          console.log('salvar', produto);
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
      form_data.append("produto_nome", value.nome);
      form_data.append("produto_descricao", value.descricao);
      form_data.append("produto_valor", value.valor);
      form_data.append("produto_qto", value.qto);
      form_data.append("status", value.status);
      await api
          .post(`/produto/${produto.id}`, form_data)
          .then(res => {
              console.log("Produto editado", res.data)
              message.success({ content: 'Produto editado com sucesso!', key });
              setLoading(false)
              setFields([])
              limparStateProduto()
              listarProdutos()
              showDrawer()
              form.resetFields();
          })
          .catch(error => {
            console.log("error: ", error, error.response)
            setLoading(false)
            message.error({ content: 'Erro ao editar produto', key, duration: 2 });
          });
    }


    async function salvar(value) {
        setLoading(true)
        let form_data = new FormData();
    
        form_data.append("produto_nome", value.nome);
        form_data.append("produto_descricao", value.descricao);
        form_data.append("produto_valor", value.valor);
        form_data.append("produto_qto", value.qto);
        form_data.append("status", value.status);
    
        await api
            .post(`/produto`, form_data, {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              }
            })
            .then(res => {
                console.log("Adicionando produto", res.data)
                setLoading(false)
                openMessage(true)
                showDrawer()
                listarProdutos()
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
          title={!produto ? 'Cadastrar novo produto' : 'Editar dados do produto'}
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
                  label="Nome do produto *"
                  rules={[{ required: true, message: 'O nome é obrigatório' }]}
                >
                  <Input placeholder="Nome do produto" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="valor"
                  label="Valor do produto *"
                  rules={[{ required: true, message: 'O valor é obrigatório' }]}
                >
                  <Input placeholder="Ex: 10.00" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="qto"
                  label="Quantidade do produto *"
                  rules={[{ required: true, message: 'A quantidade é obrigatório' }]}
                >
                  <Input type='number' placeholder="Quantidade do produto" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status do produto *"
                  rules={[{ required: true, message: 'O status é obrigatório' }]}
                >
                  <Select placeholder="Defina o status">
                    <Option value="Disponível">Disponível</Option>
                    <Option value="Fora de estoque">Fora de estoque</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="descricao"
                  label="Descrição do produto"
                //   rules={[
                //     {
                //       required: true,
                //       message: 'please enter url description',
                //     },
                //   ]}
                >
                  <Input.TextArea rows={4} placeholder="Descrição do produto" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item >
                    <Button style={{width: '100%'}} type="primary" htmlType="submit">
                        {produto ? 'Atualizar dados' : 'Salvar produto'}
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