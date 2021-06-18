import fs from 'fs-extra'
import { OpenApiParser } from '../oas'
import { PostmanMappedOperation, PostmanParser } from '../postman'

describe('PostmanMappedOperation', () => {
  let postmanParser: PostmanParser
  let oasParser: OpenApiParser
  let mappedOperation: PostmanMappedOperation

  const postmanJson = '__tests__/fixtures/crm.postman.json'
  const oasYml = '__tests__/fixtures/crm.yml'

  beforeEach(async () => {
    oasParser = new OpenApiParser()
    await oasParser.convert({ inputFile: oasYml })
    const postmanObj = JSON.parse(fs.readFileSync(postmanJson).toString())
    postmanParser = new PostmanParser({ postmanObj: postmanObj, oasParser: oasParser })
    mappedOperation = postmanParser.mappedOperations[2]
  })

  it('should use the operationIdMap to add id', () => {
    expect(mappedOperation.id).toStrictEqual('companiesOne')
  })

  it('should use the normalise the paths', () => {
    expect(mappedOperation.path).toStrictEqual('/crm/companies/:id')
    expect(mappedOperation.pathRef).toStrictEqual('GET::/crm/companies/{id}')
  })

  describe('clone()', () => {
    it('should create a clean copy of itself', () => {
      const clone = mappedOperation.clone('Get Company - Variation')
      expect(clone.id).toEqual('companiesOne-clone')
      expect(clone.item.request).toMatchSnapshot()
    })
  })
})