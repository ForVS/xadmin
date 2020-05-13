import React from 'react'
import { SchemaForm } from 'xadmin-form'
import { C } from 'xadmin-ui'
import { use } from 'xadmin'

const AddModelBtn = () => {
  const { model } = use('model')
  const { canAdd } = use('model.permission')
  const { saveItem } = use('model.save')

  const { show, dispatch } = use('redux', state => ({ show: state.showModalAddForm[model.name] || false }))
  const hideModal = () => {
    dispatch({ model, type: '@@xadmin-modalform/CLOSE' })
  }

  const onSubmitSuccess = (item) => {
    hideModal()
    dispatch({ model, type: 'GET_ITEMS' })
  }

  return (canAdd && show) ? (
    <SchemaForm 
      formKey={`model.modalform.${model.key}`}
      schema={model}
      onSubmit={saveItem}
      onSubmitSuccess={onSubmitSuccess}
    >
      { props => <C is="Form.ModalLayout" {...props} title={model.title} show={show} onClose={hideModal} /> }
    </SchemaForm>
  ) : null
}

export default {
  name: 'xadmin.model.modalform',
  blocks: {
    'model.list.navbtn': () => <AddModelBtn />
  },
  reducers: {
    showModalAddForm: (state={}, action) => {
      if(action.type == '@@xadmin-modalform/SHOW') {
        return { ...state, [action.model.name]: true }
      } else if(action.type == '@@xadmin-modalform/CLOSE') {
        return { ...state, [action.model.name]: false }
      }
      return state
    }
  },
  hooks: {
    'model.event': props => {
      const { model } = use('model')
      const { dispatch } = use('redux')
      return {
        ...props,
        onAdd: () => dispatch({ model, type: '@@xadmin-modalform/SHOW' })
      }
    }
  }
}
export { AddModelBtn }
