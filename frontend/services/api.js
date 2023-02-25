import axios from 'axios';
import { getAPIClient } from './axios';

export const api = getAPIClient()
// export const linkServer = 'https://sistema-fotos-vi.herokuapp.com'
export const linkServer = 'http://localhost:3333/api'
export const localUpload = 's3' // local ou s3