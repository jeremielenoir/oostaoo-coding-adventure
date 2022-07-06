import React from 'react'
import Message from '../components/Message'
import { render } from '@testing-library/react'

describe('Message', () => {
    test('Should render without crash', async () => {
        render(<Message />)
    })
})


