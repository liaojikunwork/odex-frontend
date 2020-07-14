// @flow
import { connect } from 'react-redux'
import orderFormSelector, { sendNewOrder } from '../../store/models/orderForm'
import { addErrorNotification } from '../../store/actions/app'
import type { State } from '../../types'

type Props = {
  onCollapse: string => void
}

export const mapStateToProps = (state: State, ownProps: Props) => {
  return {
    ...orderFormSelector(state),
    ...ownProps
  }
}

export const mapDispatchToProps = {
  sendNewOrder,
  addErrorNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
