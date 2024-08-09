import React, { useEffect, useState } from 'react'
import { Card, Space, Tag, Popconfirm, message } from 'antd'
// 导入api
import dictApi from '@/api/dict'
import roleApi from '@/api/role'
import AuthComponent from '@/components/AuthComponent'
import CustomTable from '@/components/CustomTable'
import CustomModal from '@/components/CustomModal'
import DictEditForm from './dictEditForm'
export default function DictItemTable({ editType, dict_id, dict, onRefreshTable, toggleModalStatus }) {
  // 表单组件实例
  // const [form] = Form.useForm()
  // 表单数据
  // const [allRoleArr, setAllRoleArr] = useState([])
  /** 表格参数 */
  // 表格配置项
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'dict_name',
      align: 'center'
    },
    {
      title: 'code',
      dataIndex: 'dict_code',
      align: 'center'
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      // render: (status) => {
      //   let color = status === '1' ? 'green' : 'red'
      //   const statusItem = statusDict.find((item) => item.value === status)
      //   return statusItem ? <Tag color={color}>{statusItem.label}</Tag> : ''
      // },
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, row) => (
        <Space
          style={{
            cursor: 'pointer',
            color: '#2378f7',
            fontSize: '15px'
          }}>
          {row.dict_items.length > 0 &&
            <AuthComponent permission="system:dict:check" title="查看" type="link" onClick={() => editRow(row.id)}>
              查看字典项
            </AuthComponent>
          }
          <AuthComponent permission="system:dict:edit" title="编辑" type="link" onClick={() => editRow(row.id)}>
            编辑
          </AuthComponent>
          <Popconfirm title="删除字典" description="确定要删除吗？" onConfirm={() => deleteRow(row.id)}>
            <AuthComponent permission="system:dict:del" title="删除" type="link" danger>
              删除
            </AuthComponent>
          </Popconfirm>
          {/* <Popconfirm title="重置密码" description="确定要重置吗" onConfirm={() => resetPwd(row.dict_id)}>
            <AuthComponent permission="system:user:resetPwd" type="link" title="重置密码"> */}
          {/* 重置密码 */}
          {/* </AuthComponent>
          </Popconfirm> */}
        </Space>
      ),
      align: 'center'
    }
  ]
  // 表格请求参数
  const [requestParam, setRequestParam] = useState({
    pageSize: 10,
    current: 1
  })
  /** 表格事件 */
  // 改变参数
  const onParamChange = (searchParams) => {
    if (!Object.keys(searchParams).length)
      setRequestParam({
        ...requestParam
      })
    else setRequestParam({ ...requestParam, ...searchParams })
  }
  // 新增
  const addRow = () => {
    // setEditType('add')
    // setDictId('')
    // toggleModalStatus(true)
  }
  // 编辑
  const editRow = (dict_id) => {
    // setEditType('edit')
    // setDictId(dict_id)
    // toggleModalStatus(true)
  }
  // 删除
  const deleteRow = async (dict_id) => {
    try {
      await dictApi.manage.del({ id: dict_id })
      message.success('删除成功')
      // 重新请求表格
      onParamChange({})
    } catch (e) {
      message.error(e)
    }
  }
  /** 表单参数 */
  // 弹窗实例
  // const userModalRef = useRef()
  // 功能类型
  // const [editType, setEditType] = useState()
  // 当前行用户id
  // const [dict_id, setDictId] = useState()
  // 弹窗显隐切换
  // const toggleModalStatus = (status) => {
  //   userModalRef.current.toggleShowStatus(status)
  // }
  // 取消按钮事件
  // const onCancel = () => {
  //   toggleModalStatus(false)
  //   form.resetFields()
  // }
  // // 提交按钮事件
  // const onFinish = async (value) => {
  //   // 根据不同类型编辑类型，请求不同接口
  //   switch (editType) {
  //     case 'add':
  //       await dictApi.manage.add(value)
  //       message.success('添加字典成功')
  //       break
  //     case 'edit':
  //       await dictApi.manage.update(dict_id, { ...value })
  //       message.success('修改信息成功')
  //       break
  //     default:
  //       console.log(editType)
  //   }
  //   onCancel()
  //   // 刷新表格
  //   if (editType !== 'reset') onRefreshTable({})
  //   form.resetFields()
  // }

  // useEffect(() => {
  //   // 进来先重置表单
  //   form && form.resetFields()
  //   // 请求角色选项数组
  //   if (editType !== 'reset' && !allRoleArr.length) {
  //     const fetchAllRole = async () => {
  //       const { data } = await roleApi.manage.queryAll()
  //       const filterArr = data.map((item) => ({ role_id: item.role_id, role_name: item.role_name }))
  //       setAllRoleArr(filterArr)
  //     }
  //     fetchAllRole()
  //   }
  //   // 请求当前用户id的信息
  //   if (editType === 'edit') {
  //     const fetchCurrentData = async () => {
  //       const {
  //         data: { dict_name, dict_code, description, status }
  //       } = await dictApi.manage.queryById(dict_id)
  //       // 回显值
  //       form.setFieldsValue({
  //         dict_name,
  //         dict_code,
  //         description,
  //         status
  //       })
  //     }
  //     fetchCurrentData()
  //   }
  // }, [editType, dict_id])

  return (
    <>
      <Card>
        <Space>
          <AuthComponent permission="system:dict:add" onClick={addRow}>
            新增
          </AuthComponent>
        </Space>
      </Card>
      <CustomTable
        columns={columns}
        rowKey="dict_code"
        pageType="Dict"
        bordered
        fetchMethod={dictApi.manage.query}
        requestParam={requestParam}
        onParamChange={onParamChange}
      />
      {/* <CustomModal title="字典编辑" ref={userModalRef}>
        <DictEditForm
          editType={editType}
          dict_id={dict_id}
          dict={{ statusDict }}
          onRefreshTable={onParamChange}
          toggleModalStatus={toggleModalStatus}
        />
      </CustomModal> */}
    </>
  )
}
